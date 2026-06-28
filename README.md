# The Web Maven

Strategy-first static website for The Web Maven, ready for GitHub and Netlify.

## Structure

```text
index.html          Home page
work.html           Portfolio page
contact.html        Contact page with Netlify Forms
styles.css          Shared visual system and responsive layout
animations.css      Supplemental motion utilities
main.js             Navigation, reveal animation, ticker, filters, year
netlify.toml        Netlify publish config, headers, and asset caching
Works/              Portfolio screenshots used across the site
Works/optimized/    Cropped WebP previews served by the live pages
The Web Maven/      Brand and copy source PDFs
favicon.svg         Site icon
```

## Deploy On Netlify

1. Push this folder to a GitHub repository.
2. In Netlify, create a new site from that repo.
3. Leave the build command empty.
4. Use `.` as the publish directory. This is also defined in `netlify.toml`.

The contact page uses Netlify Forms through `data-netlify="true"`, so submissions will appear in the Netlify dashboard after deployment.

## Notes

- Brand direction comes from the PDFs in `The Web Maven/`: strategic, clear, professional, human, and outcome-led.
- The main palette uses trust blue, dark slate, clean white surfaces, and restrained success/warning accents.
- The WhatsApp number is `+2348079617768`; search for that value if it needs to change.
- The large screenshots in `Works/` are preserved as fallbacks. The live pages serve cropped WebP previews from `Works/optimized/` first for much faster loading.
