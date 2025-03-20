const puppeteer = require("puppeteer");
require("dotenv").config();
const { setUtilityDate, tryGetQuoteId } = require("./bopUtility");

const { createNewQuote } = require("./createNewQuote");
const { purchaseExistingQuote } = require("./purchaseExistingQuote");
const { addPlIndicator } = require("./plIndicatorAdd");

/* ==========================
   STARTUP METHODS
   ========================== */
async function login(page) {
  if (!page.url().includes("/Account/Login")) {
    await page.goto(`${process.env.BASE_URL}/Account/Login`);
  }
  await Promise.all([
    page.waitForSelector("#UserName"),
    page.waitForSelector("#Password"),
    page.waitForSelector("#login-button"),
  ]);

  await page.type("#UserName", process.env.APP_USERNAME);
  await page.type("#Password", process.env.APP_PASSWORD);

  await page.click("#login-button");
  await page.waitForNavigation();

  return page;
}

async function startup() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();
  await login(page);
  await setUtilityDate(page, "05/04/2024");

  return { browser, page };
}

/* ==========================
    MAIN
    ========================== */
(async function main() {
  const { browser, page } = await startup();

  const quotes = []
  const policies = [];

  let consecutiveErrorCount = 0;

  for (let i = 0; i < 1; i++) {
    if (consecutiveErrorCount > 3) {
      console.error("Too many consecutive errors. Exiting...");
      break;
    }

    try {
      const policy = await createNewQuote(page);
      console.log(`Created policy: ${policy}`);
      policies.push(`"${policy}"`);
      consecutiveErrorCount = 0;
    } catch (error) {
      consecutiveErrorCount++;
      const unfinishedQuote = await tryGetQuoteId(page);
      console.log(`Error creating quote. Unfinished quote: ${unfinishedQuote}`);
      quotes.push(`"${unfinishedQuote}"`);
    }
  }

  console.log(policies.join(','));
  console.log("----------------------------------")
  console.log(quotes.filter(q => q.startsWith('Q')).join(','));

  await browser.close();
})();
