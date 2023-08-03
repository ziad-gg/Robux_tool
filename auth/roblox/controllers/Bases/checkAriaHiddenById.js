async function checkAriaHiddenById(page, elementId) {
    const element = await page.$(`#${elementId}`);
    if (!element) {
        return null;
    }

    const isHidden = await element.evaluate(el => el.getAttribute('aria-hidden') === 'true');
    return isHidden;
}

module.exports = checkAriaHiddenById;