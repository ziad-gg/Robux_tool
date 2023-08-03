const { Page } = require("puppeteer");

/**
 * 
 * @param {Page} page 
 * @returns {Promise<Boolean>}
 */

async function isLoged(page) {
    return new Promise(async (res) => {
        const newPage = await page.browser().newPage();
        await newPage.goto('https://roblox.com/home');
        await newPage.waitForNavigation({ timeout: 7_000 }).then(() => {
            newPage.close();
            res(false);
        }).catch(() => {
            newPage.close();
            res(true);
        })
    });
}

module.exports = isLoged