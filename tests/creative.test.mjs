import test from 'node:test';
import assert from 'node:assert/strict';
import {formats, escapeHTML, validURL, renderCreative} from '../web/creative.js';
const draft = {name:'Ireland',format:'billboard',brand:'Discover Ireland',headline:'Visit Ireland',description:'Explore the coast.',cta:'Explore',destination:'https://example.com/',color:'#165a47'};
const fallback = 'data:image/svg+xml;base64,PHN2Zy8+';
test('escapes advertiser text before inserting HTML',()=>{
 assert.equal(escapeHTML('<script>"&'), '&lt;script&gt;&quot;&amp;');
 const html=renderCreative({...draft,headline:'<img src=x onerror=alert(1)>'},fallback);
 assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
 assert.ok(!html.includes('<img src=x'));
});
test('only permits HTTP and HTTPS destination URLs',()=>{
 for (const url of ['javascript:alert(1)','data:text/html,hello','file:///etc/passwd','invalid']) assert.equal(validURL(url),null);
 assert.equal(validURL('https://example.com/path'),'https://example.com/path');
});
test('exports all seven formats as standalone HTML',()=>{
 assert.equal(formats.length,7);
 for(const f of formats){const html=renderCreative({...draft,format:f.id},fallback);assert.ok(html.startsWith('<!doctype html>'));assert.ok(html.includes(`ad ${f.id}`));assert.ok(html.includes(fallback));assert.ok(html.includes('ADVERTISEMENT'));assert.ok(!html.includes('src="/assets'));}
});
test('rejects arbitrary image URLs and CSS injection',()=>{
 const html=renderCreative({...draft,image:'javascript:alert(1)',color:'red;}body{display:none'},fallback);
 assert.ok(html.includes(fallback));assert.ok(!html.includes('javascript:'));assert.ok(!html.includes('red;}body{display:none')); 
});
test('carousel slide data cannot terminate its script element',()=>{
 const html=renderCreative({...draft,format:'carousel',headline:'</script><script>alert(1)</script>',slides:[{headline:'Second slide'},{headline:'Third slide'}]},fallback);
 assert.equal((html.match(/<script>/g)||[]).length,1);
 assert.equal((html.match(/<\/script>/g)||[]).length,1);
 assert.ok(html.includes('Second slide'));
});
test('property carousel embeds its public feed and escapes advertiser data',()=>{
 const html=renderCreative({...draft,format:'property',feedURL:'https://agent.example/feed.json',brand:'<script>bad</script>'},fallback);
 assert.ok(html.includes('https://agent.example/feed.json'));
 assert.ok(html.includes('&lt;script&gt;bad&lt;/script&gt;'));
 assert.ok(html.includes("['sold','rented','inactive']"));
 assert.ok(html.includes('300000'));
});
test('property carousel refuses unsafe feed URLs',()=>{
 for(const feedURL of ['javascript:alert(1)','http://agent.example/feed.json']){
  const html=renderCreative({...draft,format:'property',feedURL},fallback);
  assert.ok(html.includes('"feed":""'));
 }
});
