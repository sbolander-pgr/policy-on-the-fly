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

async function handleStartNewQuoteModal(page) {
  // click on the "Options" hamburger menu
  await page.waitForSelector("#btnOptionsMenu", { visible: true });
  await page.click("#btnOptionsMenu");

  // click on the "Start a new quote" button
  await page.waitForSelector("#btnNewQuote", { visible: true });
  await page.click("#btnNewQuote");

  // fill out modal and press "Start New Quote"
  await page.waitForSelector("#ddlNewPolicyState", { visible: true });
  await page.select("#ddlNewPolicyState", "OH");
  await page.type("#ddlAgent", "PROGRESSIVE TEST: 43786 - [Test Agent]");
  await page.click("#modalCreate .btn-primary");
}

async function createNewQuote(page) {
  await handleStartNewQuoteModal(page);
  await handleCustomerPage(page);
  await handleBusinessDetailsPage(page);
  await handlePropertyDetailsPage(page);
  await handleCoveragePage(page);
  await handleSummaryPage(page);
  await handleFinalDetailsPage(page);
  await handlePurchasePage(page);
  const policyId = await handleSoldQuotePage(page);
  return policyId;
}

module.exports = { createNewQuote };
