const { Page } = require("puppeteer");

/**
 * 
 * @param {Page} page 
 * @returns 
 */
async function clickElementWithOK(page) {
    await page.waitForSelector('button.modal-button.btn-primary-md.ng-binding', { timeout: 60_000 })
    const elements = await page.$$(`button.modal-button.btn-primary-md.ng-binding`);

    for (const element of elements) {
        const buttonText = await element.evaluate(el => el.textContent.trim());
        if (buttonText === 'OK') {
            await element.click();
            return;
        }
    }

    rej('Element with "OK" text not found');
}

module.exports = clickElementWithOK;