const { sleep, nextPage, clickRadio, clearInput } = require("./bopUtility");

/* ==========================
   CONSTANTS
   ========================== */

const answers = require("./answersLoader").answers;

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
    await page.type(businessNameSelector, answers().customerPage.businessName);
  });
  await clearInput(page, mailingAddressSelector).then(async () => {
    await page.type(mailingAddressSelector, answers().customerPage.mailingAddress);
  });
  await clearInput(page, mailingAddressCitySelector).then(async () => {
    await page.type(mailingAddressCitySelector, answers().customerPage.mailingAddressCity);
  });
  await page.select(mailingAddressStateSelector, answers().customerPage.mailingAddressState);
  await clearInput(page, mailingAddressZipSelector).then(async () => {
    await page.type(mailingAddressZipSelector, answers().customerPage.mailingAddressZip);
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

  await clearInput(page, firstNameSelector).then(async () => {
    await page.type(firstNameSelector, answers().customerPage.firstName);
  });
  await clearInput(page, lastNameSelector).then(async () => {
    await page.type(lastNameSelector, answers().customerPage.lastName);
  });
  await clearInput(page, dobSelector).then(async () => {
    await page.type(dobSelector, answers().customerPage.dob);
  });
  await clearInput(page, phoneSelector).then(async () => {
    await page.type(phoneSelector, answers().customerPage.phone);
  });
  await clearInput(page, emailSelector).then(async () => {
    await page.type(emailSelector, answers().customerPage.email);
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
    await page.type(yearCreatedSelector, answers().businessDetailsPage.yearCreated);
  });
  await clearInput(page, annualSalesSelector).then(async () => {
    await page.type(annualSalesSelector, answers().businessDetailsPage.annualSales);
  });
  await clearInput(page, numEmployeesSelector).then(async () => {
    await page.type(numEmployeesSelector, answers().businessDetailsPage.numEmployees);
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

  if (answers().coveragesPage.numPayments > 1) {
    try {
      await sleep(2000);
      const paySelector = `#chkSelect${answers().coveragesPage.numPayments}Pay`;
      await page.waitForSelector(paySelector, { visible: true });
      await page.click(paySelector);

      await sleep(1000);
      const recalculateSelector = 'button[data-analytics-id="RECALCULATE"]';
      await page.waitForSelector(recalculateSelector, { visible: true, timeout: 2000 });
      await page.click(recalculateSelector);
    } catch (error) {
      console.warn("Pay Schedule being dumb again. Skipping...");
    }
  }

  await sleep(1000);
  await nextPage(page, "SUMMARY");
}

async function handleSummaryPage(page) {
  await page.waitForSelector("#pgSummary", { visible: true });
  if (answers().summaryPage.plIndicatorAdd) {
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

  await page.select(producerNameSelector, answers().finalDetailsPage.producerName);

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
  const cardNumberSelector = "#cardNumber";
  const cardExpSelector = "#cardExpirationDate";
  const cardZipSelector = "#cardholderZipCode";

  await clearInput(page, nameOnCardSelector).then(async () => {
    await page.type(nameOnCardSelector, answers().purchasePage.nameOnCard);
  });
  await clearInput(page, cardNumberSelector).then(async () => {
    await page.type(cardNumberSelector, answers().purchasePage.cardNumber);
  });
  await clearInput(page, cardExpSelector).then(async () => {
    await page.type(cardExpSelector, answers().purchasePage.cardExpirationDate);
  });
  await clearInput(page, cardZipSelector).then(async () => {
    await page.type(cardZipSelector, answers().purchasePage.cardholderZipCode);
  });

  if (answers().coveragesPage.numPayments > 1) {
    try {
      const initialPayAmountSelector = `#initialPaymentAmt`;
      await page.waitForSelector(initialPayAmountSelector, { visible: true, timeout: 2000 });
      await page.click(initialPayAmountSelector);
    } catch (error) {
      console.warn("Initial payment radio being dumb again. Skipping...");
    }
  }

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
