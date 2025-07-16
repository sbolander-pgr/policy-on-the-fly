const puppeteer = require("puppeteer");
require("dotenv").config({ path: "./env/.env.DEV" });
const { login, setUtilityDate, tryGetQuoteId } = require("./bopUtility");

const { createNewQuote } = require("./createNewQuote");
const { purchaseExistingQuote } = require("./purchaseExistingQuote");
const { writeOutput, defaultOutputFilePath, readInput, defaultInputFilePath } = require("./filesystemUtility");
const { loadAnswers } = require("./answersLoader");

/* ==========================
   STARTUP METHODS
   ========================== */

async function startup(systemOverrideDate = null) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();
  await login(page);
  if (systemOverrideDate) {
    await setUtilityDate(page, systemOverrideDate);
  }

  return { browser, page };
}

/* ==========================
    MAIN METHODS
    ========================== */

async function processExistingQuotes(page, quoteIds, maxErrors = 3) {
  console.log(`Purchasing policies for ${quoteIds.length} existing quotes...`);

  // quoteIds.push(...[]);
  const policies = [];
  const erroredQuotes = [];
  let consecutiveErrorCount = 0;

  for (const quoteId of quoteIds) {
    if (consecutiveErrorCount > maxErrors) {
      console.error("Too many consecutive errors. Exiting...");
      break;
    }

    try {
      const policyId = await purchaseExistingQuote(page, quoteId);
      console.log(`Purchased policy for quote: ${quoteId}`);
      policies.push(policyId);
      consecutiveErrorCount = 0;
    } catch (error) {
      erroredQuotes.push(quoteId);
      consecutiveErrorCount++;
      console.error(`Error purchasing quote ${quoteId}: ${error.message}`);
    }
  }

  writeOutput(defaultOutputFilePath(), policies);

  return { erroredQuotes, reprocessedPolicies: policies };
}

async function processNewQuotes(page, totalPolicies = 1, maxErrors = 3) {
  console.log(`Creating ${totalPolicies} new policies...`);

  const quotes = [];
  const policies = [];
  let consecutiveErrorCount = 0;

  while (policies.length + quotes.length < totalPolicies) {
    if (consecutiveErrorCount > maxErrors) {
      console.error("Too many consecutive errors. Exiting...");
      break;
    }

    try {
      const policy = await createNewQuote(page);
      console.log(`Created policy: ${policy}`);
      policies.push(policy);
      consecutiveErrorCount = 0;
    } catch (error) {
      consecutiveErrorCount++;
      const unfinishedQuote = await tryGetQuoteId(page);
      console.log(`Error creating quote. Unfinished quote: ${unfinishedQuote}`);
      if (unfinishedQuote?.startsWith("Q")) quotes.push(unfinishedQuote);
    }
  }

  writeOutput('output/policies.json', policies);

  return { quotes, policies };
}

(async function main() {
  const { env, newQuoteCount, systemOverrideDate, answers } = readInput(defaultInputFilePath);
  const { browser, page } = await startup(systemOverrideDate);
  loadAnswers(answers);

  const { quotes, policies } = await processNewQuotes(page, newQuoteCount);
  const { erroredQuotes, reprocessedPolicies } = await processExistingQuotes(page, quotes);
  policies.push(...reprocessedPolicies);

  console.log("\n----------------------------------");
  console.log(`RESULTS: ${policies.length} policies created.`);
  console.log(`Errored quotes: [${erroredQuotes.join(",")}]`);

  await browser.close();
})();
