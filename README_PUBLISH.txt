BULLNEXA PUBLIC WEBSITE
GitHub + Netlify + Custom Domain Setup

FILES
- index.html       Main website page
- style.css        Website design
- stocks.js        EDIT THIS FILE to add/change/remove stocks
- script.js        Website functionality
- netlify.toml     Netlify configuration

HOW FUTURE STOCK UPDATES WORK
Once GitHub is connected to Netlify:

1. Open your Bullnexa GitHub repository.
2. Open stocks.js.
3. Click the pencil / Edit button.
4. Change the stock information.
5. Click "Commit changes".
6. Netlify detects the GitHub update and automatically deploys it.

You do NOT need to manually upload the website again after each stock change.

EXAMPLE: CHANGE IDFC FIRST BANK TO HDFC BANK

Replace:

  {
    ticker: "IDFCFIRSTB",
    company: "IDFC FIRST Bank",
    theme: "Banking / Financials",
    status: "Researching",
    view: "Tracking growth, asset quality, profitability, valuation, and long-term execution"
  },

With:

  {
    ticker: "HDFCBANK",
    company: "HDFC Bank",
    theme: "Banking / Financials",
    status: "Watching",
    view: "Tracking earnings growth, asset quality, margins, and valuation"
  },

CUSTOM DOMAIN
Desired domain:
www.bullnexa.com

Recommended structure:
bullnexa.com     -> primary domain
www.bullnexa.com -> automatically redirects or aliases to primary domain

You need to own/register the domain before it can be connected.
Domain purchase and DNS changes require access to your registrar/Netlify account.

NETLIFY WORKFLOW
- Create/import a project from the GitHub repository.
- Publish directory: .
- No build command is required for this static website.
- Add bullnexa.com under Domain Management / Production domains.
- Configure www.bullnexa.com as well.
- Follow the DNS records Netlify provides.

IMPORTANT
Publishing stock research publicly may create legal/regulatory considerations depending
on how the website is used, whether compensation is involved, and how securities are discussed.
Keep the educational/informational disclaimer and disclose positions/conflicts when relevant.
