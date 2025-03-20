const { sleep, nextPage, clickRadio, clearInput } = require("./bopUtility");

/* ==========================
   QUOTE FLOW METHODS
   ========================== */

async function handleCustomerPage(page) {
  await page.waitForSelector("#pgCustomer", { visible: true });

  // fill out Business Section
  const entityTypeSelector = "select#ddlEntityType";
  const businessNameSelector = "#dbaName";
  const mailingAddressSelector = "#mailingAddress";
  const mailingAddressCitySelector = "#mailingAddressCity";
  const mailingAddressStateSelector = "select#dllMailState";
  const mailingAddressZipSelector = "#mailingAddressZip";

  await Promise.all([
    page.waitForSelector(entityTypeSelector, { visible: true }),
    page.waitForSelector(businessNameSelector),
    page.waitForSelector(mailingAddressSelector, { visible: true }),
    page.waitForSelector(mailingAddressCitySelector, { visible: true }),
    page.waitForSelector(mailingAddressStateSelector, { visible: true }),
    page.waitForSelector(mailingAddressZipSelector, { visible: true }),
  ]);

  await page.select(entityTypeSelector, "1");
  await clearInput(page, businessNameSelector).then(async () => {
    await page.type(businessNameSelector, "RENEWAL RECOVERY TEST");
  });
  await clearInput(page, mailingAddressSelector).then(async () => {
    await page.type(mailingAddressSelector, "4061 ERIE ST");
  });
  await clearInput(page, mailingAddressCitySelector).then(async () => {
    await page.type(mailingAddressCitySelector, "WILLOUGHBY");
  });
  await page.select(mailingAddressStateSelector, "OH");
  await clearInput(page, mailingAddressZipSelector).then(async () => {
    await page.type(mailingAddressZipSelector, "44094");
  });

  await sleep(1000).then(async () => {
    await page.mouse.wheel({ deltaY: 1000 });
  });

  // fill out Business Owner section
  const firstNameSelector = "#firstName";
  const lastNameSelector = "#lastName";
  const dobSelector = "#dob";
  const homeAddressChoiceSelector = '[id="hideMailing inlineRadio1"]';
  const phoneSelector = "#phone";
  const emailSelector = "#email";

  await Promise.all([
    page.waitForSelector(firstNameSelector, { visible: true }),
    page.waitForSelector(lastNameSelector, { visible: true }),
    page.waitForSelector(dobSelector, { visible: true }),
    page.waitForSelector(phoneSelector, { visible: true }),
    page.waitForSelector(emailSelector, { visible: true }),
  ]);

  await clearInput(page, firstNameSelector);
  await page.type(firstNameSelector, "RENEWAL");
  await clearInput(page, lastNameSelector).then(async () => {
    await page.type(lastNameSelector, "RECOVERY");
  });
  await clearInput(page, dobSelector).then(async () => {
    await page.type(dobSelector, "01/01/1980");
  });
  await clearInput(page, phoneSelector).then(async () => {
    await page.type(phoneSelector, "444-444-4444");
  });
  await clearInput(page, emailSelector).then(async () => {
    await page.type(emailSelector, "test@e-ins.net");
  });

  await clickRadio(page, homeAddressChoiceSelector);

  await nextPage(page, "BUSINESS DETAILS");
}

async function handleBusinessDetailsPage(page) {
  await page.waitForSelector("#pgBusinessDetails", { visible: true });

  // Business Category
  const businessCategorySelector = "#contractor";
  const contractorKOSelector = "input#rdoCategoryKO2";

  await page.waitForSelector(businessCategorySelector, { visible: true });
  await page.click(businessCategorySelector);
  await sleep(500).then(async () => {
    await page.mouse.wheel({ deltaY: 100 });
  });
  await page.waitForSelector(contractorKOSelector, { visible: true });
  await page.click(contractorKOSelector);
  await page.click(contractorKOSelector);
  await sleep(500);

  // Business Class
  const primaryBusinessClassSelector =
    "#BusinessPartialPage-ddlBusinessClass_1";

  await page.select(primaryBusinessClassSelector, "269");

  // Business Overview
  const yearCreatedSelector = "#yearCreated";
  const annualSalesSelector = "#annualSales";
  const numEmployeesSelector = "#numEmployees";

  await Promise.all([
    page.waitForSelector(yearCreatedSelector, { visible: true }),
    page.waitForSelector(annualSalesSelector, { visible: true }),
    page.waitForSelector(numEmployeesSelector, { visible: true }),
  ]);

  await clearInput(page, yearCreatedSelector).then(async () => {
    await page.type(yearCreatedSelector, "2018");
  });
  await clearInput(page, annualSalesSelector).then(async () => {
    await page.type(annualSalesSelector, "150000");
  });
  await clearInput(page, numEmployeesSelector).then(async () => {
    await page.type(numEmployeesSelector, "0");
  });

  // Business Overview Radio
  const performsOutOfStateWorkSelector = "#rdoPerformsOutOfStateWork2";
  const subcontractorSelector = "#rdoSubcontractor2";
  const buildContentsSelector = "#rdoBuildContents2";
  const havePolicySelector = "#rdoHavePolicy2";
  const hasAutoInsuranceSelector = "#rdoHasAutoInsurance2";
  const commercialPropSelector = "#rdoCommericalProp2";

  await Promise.all([
    page.waitForSelector(performsOutOfStateWorkSelector, { visible: true }),
    page.waitForSelector(subcontractorSelector, { visible: true }),
    page.waitForSelector(buildContentsSelector, { visible: true }),
    page.waitForSelector(havePolicySelector, { visible: true }),
    page.waitForSelector(hasAutoInsuranceSelector, { visible: true }),
    page.waitForSelector(commercialPropSelector, { visible: true }),
  ]).then(async () => {
    await page.mouse.wheel({ deltaY: 1000 });
  });

  await page.click(performsOutOfStateWorkSelector);
  await page.click(subcontractorSelector);
  await page.click(buildContentsSelector);
  await page.click(havePolicySelector);
  await page.click(hasAutoInsuranceSelector);
  await page.click(commercialPropSelector);

  await sleep(1000).then(async () => {
    await nextPage(page, "PROPERTY DETAILS");
  });
}

async function handlePropertyDetailsPage(page) {
  await page.waitForSelector("#pgPropertyDetails", { visible: true });
  await nextPage(page, "RATE");
}

async function handleCoveragePage(page) {
  await page.waitForSelector("#pgRate", { visible: true });
  await sleep(1000);
  await nextPage(page, "SUMMARY");
}

async function handleSummaryPage(page, plIndicatorAdd = false) {
  await page.waitForSelector("#pgSummary", { visible: true });
  if (plIndicatorAdd) {
    const plIndicatorSelector = "#uwSetRenewalRecoveryEventFlag";
    await page.waitForSelector(plIndicatorSelector, { visible: true });
    await page.click(plIndicatorSelector);
  }
  await nextPage(page, "FINAL DETAILS");
}

async function handleFinalDetailsPage(page) {
  await sleep(1000);
  await page.waitForSelector("#pgFinalDetails", { visible: true });

  // Agent Section
  const producerNameSelector = "select#ddlProducer";

  await page.waitForSelector(producerNameSelector, { visible: true });

  await page.select(producerNameSelector, "BOPAgent");

  // Customer Section
  const customerContactSelector = "#rdoAllowContactNo";
  await clickRadio(page, customerContactSelector);

  await nextPage(page, "PURCHASE");
}

async function handlePurchasePage(page) {
  await sleep(2000);
  await page.waitForSelector("#pgPurchase", { visible: true });

  // Initial Payment
  const nameOnCardSelector = "#nameOnCard";
  await page.type(nameOnCardSelector, "RENEWAL RECOVERY");

  const cardNumberSelector = "#cardNumber";
  await page.type(cardNumberSelector, "4111111111111111");

  const cardExpSelector = "#cardExpirationDate";
  await page.type(cardExpSelector, "12/30");

  const cardZipSelector = "#cardholderZipCode";
  await page.type(cardZipSelector, "44094");

  await nextPage(page, "COMPLETE");
}

async function handleSoldQuotePage(page) {
  await page.waitForSelector("#pgPurchaseConfirmation", { visible: true });

  const policyIdSelector = 'span[data-bind="text: PolicyId"]';

  await page.waitForSelector(policyIdSelector, { visible: true });

  const policyId = await page.$eval(policyIdSelector, (el) => el.innerText);

  return policyId;
}

module.exports = {
  handleCustomerPage,
  handleBusinessDetailsPage,
  handlePropertyDetailsPage,
  handleCoveragePage,
  handleSummaryPage,
  handleFinalDetailsPage,
  handlePurchasePage,
  handleSoldQuotePage
};
