const puppeteer = require("puppeteer");
require("dotenv").config();
const { createNewQuote } = require("./createNewQuote");
const { purchaseExistingQuote } = require("./purchaseExistingQuote");

/* ==========================
   LOGIN METHODS
   ========================== */
async function login(page) {
    if (!page.url().includes("/Account/Login")) {
        await page.goto(`${process.env.BASE_URL}/Account/Login`);
    }
    await Promise.all([
        page.waitForSelector("#UserName"),
        page.waitForSelector("#Password"),
        page.waitForSelector("#login-button")
    ]);

    await page.type("#UserName", process.env.APP_USERNAME);
    await page.type("#Password", process.env.APP_PASSWORD);
    
    await page.click("#login-button");
    await page.waitForNavigation();
    
    return page;
}

/* ==========================
    MAIN
    ========================== */
(async function main() {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ["--start-maximized"] });

    const page = await browser.newPage();
    await login(page);

    const quotes = [];

    const policies = [];

    try {
        for (let quote of quotes) {
        // for (let i = 0; i < 1; i++) {
        //     const policyId = await createNewQuote(browser);
            const policyId = await purchaseExistingQuote(browser, quote);
            console.log(`New policy created with ID: ${policyId}`);
            policies.push(policyId);
        }
    } catch (error) {
        console.error("Error creating new quotes:", error);
    } finally {
        console.log(JSON.stringify(policies));
        console.log("Total policies created:", policies.length);
    }

    await browser.close();
})();