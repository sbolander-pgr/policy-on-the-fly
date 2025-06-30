const { handleSearchExistingQuote } = require("./bopUtility");
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

async function purchaseExistingQuote(page, quoteId) {
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
