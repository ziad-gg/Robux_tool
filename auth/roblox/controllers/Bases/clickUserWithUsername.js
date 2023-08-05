async function clickUserWithUsername(page, username) {
    await page.waitForSelector('div.search-result-name.text-overflow.ng-scope.ng-isolate-scope span.element.ng-binding[ng-bind="userName"]', { timeout: 60_000 })
    const elements = await page.$$(`div.search-result-name.text-overflow.ng-scope.ng-isolate-scope span.element.ng-binding[ng-bind="userName"]`);

    for (const element of elements) {
        const elementUsername = await element.evaluate(el => el.textContent.trim());
        if (elementUsername.toLowerCase() === username.toLowerCase()) {
            await element.click();
            return;
        }
    }

    rej(`Element with username "${username}" not found`);
}

module.exports = clickUserWithUsername;