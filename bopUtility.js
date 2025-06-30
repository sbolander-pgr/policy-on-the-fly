/* ==========================
   HELPER METHODS
   ========================== */
async function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function nextPage(page, selector) {
  await sleep(1000);
  const nextBtnSelector = `button[data-pgr-id="QuoteFooterPartialPage-Next-${selector}"]`;
  await page.waitForSelector(`${nextBtnSelector}:not([disabled])`, {
    visible: true,
  });
  await page.click(nextBtnSelector);
  await sleep(1000);
}

async function clickRadio(page, selector, sleepTime = 500) {
  await sleep(sleepTime);
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector);
  await sleep(sleepTime);
}

async function clearInput(page, selector) {
  await page.click(selector, { clickCount: 3 });
  await page.keyboard.press("Backspace");
  await page.keyboard.press("Backspace");
  await page.keyboard.press("Backspace");
  await page.keyboard.press("Backspace");
  await page.keyboard.press("Backspace");
  await page.keyboard.press("Backspace");
  await page.keyboard.press("Backspace");
  await page.keyboard.press("Backspace");
  await sleep(1000);
}

/* ==========================
    BOP UTILITY METHODS
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

async function handleSearchExistingQuote(page, quoteId) {
  await sleep(1000);
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

async function setUtilityDate(page, date) {
  await sleep(200);
  const dateSpanSelector =
    'span[data-bind="text: SystemDateText, click:  $root.gotoUtilitySystemDatesPage"]';
  await page.waitForSelector(dateSpanSelector, { visible: true });
  await page.click(dateSpanSelector);

  const dateInputSelector = "#utilitySetSystemDate";
  await page.waitForSelector(dateInputSelector, { visible: true });
  await page.type(dateInputSelector, date);

  const setButtonSelector = '.btn[data-bind="click: SetDate"]';
  await page.click(setButtonSelector);

  await sleep(300);
}

async function tryGetQuoteId(page) {
  try {
    const quoteIdSelector = 'dd[data-bind="text: PolicyId"]';

    await page.waitForSelector(quoteIdSelector);

    const quoteId = await page.$eval(quoteIdSelector, (el) => el.innerText);

    return quoteId;
  } catch (error) {
    console.error("Error getting quoteId");
    return null;
  }
}

module.exports = {
  sleep,
  nextPage,
  clickRadio,
  clearInput,
  login,
  handleSearchExistingQuote,
  setUtilityDate,
  tryGetQuoteId,
};
