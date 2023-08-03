async function findButtonByText(page, buttonText) {
    const buttons = await page.$x(`//button[contains(., "${buttonText}")]`);
    if (buttons.length > 0) {
        const button = buttons[0];
        const isDisabled = await button.evaluate(el => el.hasAttribute('disabled'));
        return { Button: button, isDisabled };
    }
    return { Button: null, isDisabled: true };
}

module.exports = findButtonByText;