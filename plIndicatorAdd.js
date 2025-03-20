const { sleep, handleSearchExistingQuote } = require('./bopUtility');

const renewalRecoveryIndicatorSelector = '#indicator_5';

async function handleIndicatorCheckbox(page) {
  await page.waitForSelector(renewalRecoveryIndicatorSelector, { visible: true });
  const isChecked = await page.$eval(renewalRecoveryIndicatorSelector, (el) => el.checked);
  if (!isChecked) {
    return;
  } else {
    await page.click(renewalRecoveryIndicatorSelector);
  }
}

async function handleIndicatorModal(page) {
  await sleep(1000);

  const actionsBtnSelector = '.btn--footer.dropdown-toggle[data-bind="disable: IsActionsDisabled"]';
  await page.waitForSelector(actionsBtnSelector, { visible: true });
  await page.click(actionsBtnSelector);

  const managePolicySelector = '.dropdown-item[data-target="#modalManagePolicy"]';
  await page.waitForSelector(managePolicySelector, { visible: true });
  await page.click(managePolicySelector);

  await handleIndicatorCheckbox(page);
  await sleep(500);

  const processBtnSelector = '.btn[data-bind="click: PostIndicators"]';
  await page.waitForSelector(processBtnSelector, { visible: true });
  await page.click(processBtnSelector);
  await sleep(500);
}

async function addPlIndicator(browser, policyId) {
  const page = await browser.newPage();
  await page.goto(process.env.BASE_URL);
  await handleSearchExistingQuote(page, policyId);
  await handleIndicatorModal(page);
  await page.close();
}

module.exports = { addPlIndicator };