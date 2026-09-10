# HY Watches — storefront

Next.js 14 (App Router) + TypeScript + Tailwind CSS. Single-route static
storefront. No cart, no checkout: every buy action opens a pre-filled
WhatsApp thread to +61 450 935 568.

## Run

    npm install
    npm run dev

## Deploy (Vercel)

    git init && git add -A && git commit -m "HY Watches storefront"
    git remote add origin git@github.com:<you>/hy-watches.git
    git push -u origin main

Import the repo at vercel.com/new. Framework preset is detected as Next.js.
No environment variables, no build-command override, no external services.
Verified: `next build` completes clean, 4/4 static pages, 104 kB first load.

## Files

    app/page.tsx        entire storefront (client component)
    app/layout.tsx      metadata, viewport, globals import
    app/globals.css     design tokens, cursor, orbs, ticker, marquee, keyframes
    tailwind.config.ts  content globs + ink/gold scales + easing tokens
    postcss.config.mjs  tailwindcss + autoprefixer
    .eslintrc.json      next/core-web-vitals, no-img-element disabled

## Changing the phone number

`WHATSAPP_NUMBER` at the top of app/page.tsx. Digits only, country code
first, no plus sign or spaces.

## Swapping in real photography

Product, feature, banner and social images are generated as data-URI SVG by
`watchImage`, `featureImage`, `bannerImage` and `reelImage`. Replace the
`image` field on each `Product` / `SocialPost` with a URL and delete the
generator functions. Interfaces do not change. If you move to `next/image`,
add the host to `images.remotePatterns` in next.config.mjs.

## If your extractor hides dotfiles

`.eslintrc.json` and `.gitignore` begin with a dot and are hidden by default
in macOS Finder (Cmd+Shift+. to show), Windows Explorer, and `ls`. They are
in this archive. Recreate them by hand only if they are genuinely absent:

.eslintrc.json

    {
      "extends": "next/core-web-vitals",
      "rules": { "@next/next/no-img-element": "off" }
    }

.gitignore

    node_modules
    .next
    out
    build
    .DS_Store
    *.pem
    .env*.local
    .vercel
    next-env.d.ts
    *.tsbuildinfo
