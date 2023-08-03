async function writeAmountToInput(page, amount) {
    const inputSelector = 'input.form-control.input-field.input-number';
    await page.waitForSelector(inputSelector, { visible: true });
    await page.evaluate((selector) => {
        const inputField = document.querySelector(selector);
        inputField.value = '';
    }, inputSelector);
    await page.focus(inputSelector);
    await page.keyboard.type(amount.toString());
}

module.exports = writeAmountToInput;