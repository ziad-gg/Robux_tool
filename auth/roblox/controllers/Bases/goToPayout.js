async function goToPayout(page) {
    await page.waitForSelector('span.text-lead.ng-binding', { timeout: 60000 }); // Wait for up to 60 seconds

    const elements = await page.$$('span.text-lead.ng-binding'); // Get all elements with the class
    for (const element of elements) {
        const text = await element.evaluate(el => el.textContent);
        if (text.trim() === 'One-time Payout') {
            await element.click();
            return; // Click the first matching element and exit the loop
        }
    }

    rej('Element with text "One-time Payout" not found');
};

module.exports = goToPayout;