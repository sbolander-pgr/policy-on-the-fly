const puppeteer = require("puppeteer");
require("dotenv").config();
const { login, setUtilityDate, tryGetQuoteId } = require("./bopUtility");

const { createNewQuote } = require("./createNewQuote");
const { purchaseExistingQuote } = require("./purchaseExistingQuote");
const { addPlIndicator } = require("./plIndicatorAdd");

/* ==========================
   STARTUP METHODS
   ========================== */

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
    MAIN METHODS
    ========================== */

async function processExistingQuotes(page, quoteIds, maxErrors = 3) {
  console.log(`Purchasing policies for ${quoteIds.length} existing quotes...`);
  
  const policies = [];
  let consecutiveErrorCount = 0;

  for (const quoteId of quoteIds) {
    if (consecutiveErrorCount > maxErrors) {
      console.error("Too many consecutive errors. Exiting...");
      break;
    }

    try {
      const policyId = await purchaseExistingQuote(page, quoteId);
      console.log(`Purchased policy for quote: ${quoteId}`);
      policies.push(`"${policyId}"`);
      consecutiveErrorCount = 0;
    } catch (error) {
      consecutiveErrorCount++;
      console.error(`Error purchasing quote ${quoteId}: ${error.message}`);
    }
  }

  return policies;
}

async function processNewQuotes(page, totalPolicies = 1, maxErrors = 3) {
  console.log(`Creating ${totalPolicies} new policies...`);

  const quotes = [];
  const policies = [];
  let consecutiveErrorCount = 0;

  while ((policies.length + quotes.length) < totalPolicies) {
    if (consecutiveErrorCount > maxErrors) {
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

  return { quotes, policies };
}

(async function main() {
  const { browser, page } = await startup();

  const { quotes, policies } = await processNewQuotes(page, 51);
  const reprocessedPolicies = await processExistingQuotes(page, quotes);
  policies.push(...reprocessedPolicies);

  console.log("----------------------------------");
  console.log(`RESULTS: ${policies.length} policies created.`);
  console.log(policies.join(','));
  console.log("----------------------------------");
  console.log(quotes.filter(q => q.startsWith('Q')).join(','));

  await browser.close();
})();
