from pathlib import Path
from playwright.sync_api import sync_playwright, expect
BASE=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':1100})
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto('http://127.0.0.1:3000/',wait_until='networkidle')
    page.locator('[data-open="property"]').first.click()
    frame=page.frame_locator('#ad-preview')
    expect(frame.locator('.state')).to_contain_text('DEMO LISTINGS')
    expect(frame.locator('.counter')).to_have_text('1 / 3')
    frame.get_by_role('button',name='Next property').click()
    expect(frame.locator('.title')).to_have_text('Your countryside escape')
    frame.get_by_role('button',name='Pause rotation').click()
    expect(frame.get_by_role('button',name='Resume rotation')).to_be_visible()
    requests=[]
    def feed(route):
        requests.append(route.request.url)
        route.fulfill(json={'listings':[
            {'title':'Seaside home','price':'€450,000','location':'Galway','url':'https://agent.example/home/1','image':'https://agent.example/home.jpg','status':'active'},
            {'title':'Sold property','url':'https://agent.example/home/2','status':'sold'},
            {'title':'Townhouse','price':'€300,000','location':'Cork','url':'https://agent.example/home/3'},
            {'title':'Unsafe link','url':'javascript:alert(1)'}
        ]},headers={'Access-Control-Allow-Origin':'*'})
    context.route('https://agent.example/feed.json',feed)
    page.locator('#feed-url').fill('https://agent.example/feed.json')
    page.locator('#feed-reload').click()
    expect(frame.locator('.title')).to_have_text('Seaside home')
    expect(frame.locator('.price')).to_have_text('€450,000')
    expect(frame.locator('.counter')).to_have_text('1 / 2')
    expect(frame.locator('.cta')).to_have_attribute('href','https://agent.example/home/1')
    expect(frame.locator('.state')).to_contain_text('Feed updated')
    frame.get_by_role('button',name='Next property').click()
    expect(frame.locator('.title')).to_have_text('Townhouse')
    page.locator('#save').click()
    expect(page.locator('#save-state')).to_have_text('Saved to My creatives')
    page.get_by_role('button',name='Close editor').click()
    page.locator('[data-view="drafts"]').click()
    page.locator('.card-action').click()
    expect(page.locator('#feed-url')).to_have_value('https://agent.example/feed.json')
    context.route('https://agent.example/broken.json',lambda route:route.fulfill(status=500,headers={'Access-Control-Allow-Origin':'*'},body='unavailable'))
    page.locator('#feed-url').fill('https://agent.example/broken.json')
    page.locator('#feed-reload').click()
    expect(frame.locator('.state')).to_contain_text('Feed unavailable')
    page.locator('#feed-url').fill('')
    page.locator('#feed-reload').click()
    expect(frame.locator('.state')).to_contain_text('DEMO LISTINGS')
    page.screenshot(path=str(BASE/'dist'/'property-carousel.png'),full_page=True)
    assert requests, 'Live feed never fetched'
    assert not errors, errors
    browser.close()
    print('PASS: property demo, navigation, pause, public JSON feed, active-only filtering, unsafe-link filtering, per-listing links, saved feed configuration, and visible feed errors. Tested with controlled feed fixtures, not a real agent feed.')
