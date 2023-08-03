const { Page } = require("puppeteer");
const fs = require("node:fs");
const isLoged = require("./isLoged");

/**
 * 
 * @param {Page} page 
 * @returns {Promise<{ done: Boolean, message?: string }>}
 */

async function restore_sessions(page) {
    return new Promise(async (res, rej) => {
        if (!fs.existsSync('cookies.json') || !fs.existsSync('localstorage.json')) return res({ done: false, message: 'No sessions to Restore' });

        const cookiesString = await fs.readFileSync('cookies.json');
        const localStorageData = await fs.readFileSync('localstorage.json', 'utf-8');

        const cookies = JSON.parse(cookiesString);
        const localStorage = JSON.parse(localStorageData);

        await page.setCookie(...cookies);
        await page.evaluate((localStorage) => {
            for (const key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    window.localStorage.setItem(key, localStorage[key]);
                }
            }
        }, localStorage);

        await page.reload({ timeout: 60_000 });

        res({ done: await isLoged(page) });
    });
};

module.exports = restore_sessions