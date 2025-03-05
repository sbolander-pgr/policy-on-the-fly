const {
  handleCustomerPage,
  handleBusinessDetailsPage,
  handlePropertyDetailsPage,
  handleCoveragePage,
  handleSummaryPage,
  handleFinalDetailsPage,
  handlePurchasePage,
  handleSoldQuotePage,
} = require("./handleQuote");

async function handleSearchExistingQuote(page, quoteId) {
  await page.waitForSelector("#btnOptionsMenu", { visible: true });
  await page.click("#btnOptionsMenu");

  const searchBarBtnSelector = 'button[data-bind="click: gotoLookupPage"]';
  await page.waitForSelector(searchBarBtnSelector, { visible: true });
  await page.click(searchBarBtnSelector);

  await page.waitForSelector("#pgLookup", { visible: true });

  // enter quoteId
  const quoteInputSelector = "#lookupQuotePolicy";
  await page.waitForSelector(quoteInputSelector, { visible: true });
  await page.type(quoteInputSelector, quoteId);

  // click LOOKUP button
  const lookupBtnSelector =
    'button[data-bind="click: lookupPage.searchInternalQuotes"]';
  await page.waitForSelector(lookupBtnSelector, { visible: true });
  await page.click(lookupBtnSelector);
}

async function purchaseExistingQuote(browser, quoteId) {
  const page = await browser.newPage();
  await page.goto(process.env.BASE_URL);
  await handleSearchExistingQuote(page, quoteId);
  await handleCustomerPage(page);
  await handleBusinessDetailsPage(page);
  await handlePropertyDetailsPage(page);
  await handleCoveragePage(page);
  await handleSummaryPage(page);
  await handleFinalDetailsPage(page);
  await handlePurchasePage(page);
  const policyId = await handleSoldQuotePage(page);
  await page.close();
  return policyId;
}

module.exports = { purchaseExistingQuote };
