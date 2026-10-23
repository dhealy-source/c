# Put Ad Studio online

Publishing this Codex cloud environment saves a development snapshot. It does **not** publish a website or install ads on IrishCentral.

## Fastest option: upload the website folder

1. Download and unzip `dist/ad-studio-website.zip`.
2. Sign in to your Netlify account and visit https://app.netlify.com/drop .
3. Drag the unzipped website folder (the one containing `index.html`) into the upload area.
4. Netlify supplies a public HTTPS website address. Open that address to start building ads. A custom domain can be configured in your hosting account.

This package is static: no backend, database, server installation, or API key is required. The ad builder is public, while each browser's saved creatives stay in that browser. It is not a shared advertiser account system. Export HTML copies to keep or move your work.

Alternatively, connect this GitHub repository to Netlify. The included `netlify.toml` publishes the `web` directory; no build command is required. The web app uses absolute paths and should be hosted at the root of its own domain or subdomain, not under a subdirectory.

## Put an ad on IrishCentral

1. Create an ad in the builder and export its HTML.
2. Upload that HTML to a public HTTPS location controlled by you or your publisher, or import it into your ad server if HTML creatives are supported.
3. Have the IrishCentral publishing team insert it in an appropriate ad slot using their CMS or ad server. They control script permissions, content security policy, consent requirements and placement.

Example markup, **after replacing the placeholder URL** with the actual uploaded creative URL:

```html
<iframe
  title="Property advertisement"
  src="https://YOUR-AD-HOST.example/agent-property-carousel.html"
  width="600"
  height="300"
  style="border:0;max-width:100%"
  loading="lazy"
  sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
></iframe>
```

The builder preview scales fixed-size ads. The property creative itself adapts to its iframe width; choose a slot with sufficient height and test it in the publisher's real page.

## Connect a real estate feed

Choose **Live property carousel**, then enter a public HTTPS JSON feed URL. Click **Refresh preview**, verify the listings, then save or export the creative. An empty feed field shows clearly labeled demonstration listings.

Supported feed data is either a JSON array, or an object with a `listings` array:

```json
{
  "listings": [
    {
      "title": "Example home",
      "price": "€450,000",
      "location": "Galway, Ireland",
      "image": "https://AGENT.example/images/home.jpg",
      "url": "https://AGENT.example/properties/home",
      "status": "active"
    }
  ]
}
```

`title` and a valid HTTPS `url` are required. `image`, `price`, `location` and `status` are optional. The feed is limited to the first 25 usable active records. Status values `sold`, `rented` and `inactive` are excluded. Each property's button opens its own URL.

The ad rotates every 7 seconds, offers previous/next and pause buttons, and polls the feed every 5 minutes while open. New visitors fetch the current feed immediately. Automatic rotation pauses while a control has focus or the page is hidden, and starts paused for visitors who prefer reduced motion. This is periodic refresh, not instantaneous synchronization. If a refresh fails, a loaded ad keeps the last successful feed and labels the error. A newly loaded ad with a failed feed shows an unavailable message, not invented listings.

The agent's feed server must permit cross-origin browser requests. With the sandboxed preview and recommended iframe, use `Access-Control-Allow-Origin: *` for this intentionally public, credential-free feed. Do not place an API key, username, password, or private listing data in the feed URL. Public listing images must also be accessible over HTTPS.

If the provider offers XML/RSS, an authenticated API, MLS/IDX data, a spreadsheet, or only a website, a provider-specific server adapter is needed. It is not implemented yet. Obtain the provider's supported feed details and authorized access before connecting one. An ordinary property website URL is not a JSON feed.

The feed feature was validated using controlled JSON fixtures. A real agent's feed and IrishCentral's CMS have not been connected or tested.
