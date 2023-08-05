const { Page } = require("puppeteer");
const { Zoblox } = require('zoblox.js');
const { setTimeout: wait } = require("node:timers/promises");
const fs = require('node:fs');
const mail = require("../google.js")
const restore_session = require("../handlers/restore_sessions");

/**
 * 
 * @param {Page} page 
 * @param {String} username 
 * @param {String} password 
 */

async function Login(page, username, password) {
  return new Promise(async (res, rej) => {

    if (!page || !username || !password) throw new Error('page, username, and password are required parameters in the function');
    let isLoged = false;
    const client = new Zoblox();

    const { done } = await restore_session(page);

    if (done) {
      isLoged = true;
      console.log('loged using saved session');
    };

    while (isLoged) {
      const cookies = JSON.parse(await fs.readFileSync('cookies.json', 'utf8'))
      const cookie = cookies.find(field => field.name === '.ROBLOSECURITY')?.value;

      client.on('userReady', () => {
        res(client)
      });

      client.login(cookie);


      break;
    };

    if (isLoged) return;

    await wait(5000);
    page.type('input[id="login-username"]', username);
    await wait(1000);
    page.type('input[id="login-password"]', password);
    await wait(1000);
    await page.waitForSelector('[id="login-button"]');
    page.click('[id="login-button"]');

    let verificationCode = null;
    let attempts = 0;

    while (!verificationCode && attempts < 60) { // Try for up to 60 seconds (1 minute)
      await wait(15_000);
      const dialogModal = await page.$('div[role="dialog"][aria-hidden="true"]');

      // console.log("dialog: ", dialogModal)
      if (dialogModal) {
        await wait(10_000);
        
        const { message, done } = await mail();

        if (message.includes(username)) {
          const codeRegExp = /\b(\d{6})\b/;
          const match = message.match(codeRegExp);
          if (match && match[1]) {
            verificationCode = match[1];
            console.log('Found verification code:', verificationCode);
          } else {
            console.log('Unable to extract the verification code from the message:', message);
          }
        } else {
          console.log('Message does not contain the 2-Step Verification Code or does not include the username.');
        }

      } else {

        let Iattempts = 0;

        while (!isLoged && Iattempts < 10) {

          const CheckPage = await page.browser().newPage();
          await CheckPage.goto('https://roblox.com/home');
          await CheckPage.waitForNavigation({ timeout: 10_000 }).then(() => {
            fs.unlinkSync('cookies.json');
            fs.unlinkSync('localstorage.json');
            Login(page, username, password);
            CheckPage.close();
            console.log('First attemp had an error');

          }).catch(async () => {
            console.log('This process did not require any verfication step');
            const cookies = await page.cookies();
            const localStorage = await page.evaluate(() => JSON.stringify(window.localStorage));
            await fs.writeFileSync('cookies.json', JSON.stringify(cookies));
            await fs.writeFileSync('localstorage.json', localStorage);
            CheckPage.close();
            isLoged = true;
          });

          Iattempts++;
          await wait(5000);
        };

        break;
      };

      attempts++;

      await wait(5000);
    }

    if (verificationCode) {
      console.log('Proceeding with the verification process using the obtained code...');
      const codeInput = await page.$('input[id="two-step-verification-code-input"]');
      const checkInput = await page.$('input[id="remember-device"]');
      const confirmButton = await page.$('button[class="btn-cta-md modal-modern-footer-button"]');
      codeInput.type(verificationCode);
      await wait(4000);
      checkInput.click();
      await wait(1000);
      confirmButton.click();

      await page.waitForNavigation({ timeout: 60_000 });

      // logged in now, save cookies and local storage
      const cookies = await page.cookies();
      const localStorage = await page.evaluate(() => JSON.stringify(window.localStorage));
      await fs.writeFileSync('cookies.json', JSON.stringify(cookies));
      await fs.writeFileSync('localstorage.json', localStorage);
      isLoged = true;


    } else if (!isLoged && !verificationCode) {
      console.log('Unable to retrieve the verification code automatically. Please complete the 2-Step Verification process manually.');
    }

    while (isLoged) {
      const cookies = JSON.parse(await fs.readFileSync('cookies.json', 'utf8'))
      const cookie = cookies.find(field => field.name === '.ROBLOSECURITY')?.value;

      client.on('userReady', () => {
        res(client)
      });

      client.login(cookie);


      break;
    };




  });
}

module.exports = Login;