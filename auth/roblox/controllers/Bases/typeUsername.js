async function typeUsername(page, username) {
    await page.waitForSelector('#add-users-textbox', { visible: true });

    // Clear the input field before typing the username
    await page.evaluate(() => {
        const inputField = document.querySelector('#add-users-textbox');
        inputField.value = '';
    });

    // Type the username letter by letter
    for (const char of username) {
        await page.type('#add-users-textbox', char, { delay: 40 }); // You can adjust the delay as needed
    }
}

module.exports = typeUsername