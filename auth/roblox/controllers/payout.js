const { Page } = require("puppeteer");
const Zoblox = require("zoblox.js");
const { setTimeout: wait } = require("node:timers/promises");
const mail = require("../../google.js");
const goToPayout = require("./Bases/goToPayout.js");
const typeUsername = require("./Bases/typeUsername.js");
const clickUserWithUsername = require("./Bases/clickUserWithUsername.js");
const clickElementWithOK = require("./Bases/clickElementWithOK.js");
const writeAmountToInput = require("./Bases/writeAmountToInput.js");
const findButtonByText = require("./Bases/findButtonByText.js");
const checkAriaHiddenById = require("./Bases/checkAriaHiddenById.js");


/**
 * @param {Zoblox} client
 * @param {Page} page
 * @param {String} username 
 * @param {Number | String} groupId
 * @param {Number} amount 
 */


async function Payout(client, page, username, groupId, amount) {

    return new Promise(async (res, rej) => {

        if (!page || !username || !amount || !groupId) return rej({ error: true, code: 2, message: "Missing Required arguments" });

        // let user = await client.users.find({ userNames: username });
        // if (!user) return rej({ error: true, code: 3, message: "User is not found in roblox" });
        // user = await client.users.get(user.id);

        // const Group = await client.groups.get(groupId);
        // if (!Group) return rej({ error: true, code: 4, message: "Invalid Group Id" });

        // const member = await Group.members.get(user.id);
        // if (!member) return rej({ error: true, code: 5, message: "User is not found in Group" });

        // const robux = await Group.fetchCurrency();
        // if (robux < amount) return rej({ error: true, code: 6, message: "Robux is not enough" });

        // const me = await Group.members.me;
        // if (!me || !me.isOwner) return rej({ error: true, code: 7, message: "You must be the owner of the group" });

        const GroupPage = await page.browser().newPage();
        await GroupPage.goto(`https://www.roblox.com/groups/configure?id=${groupId}#!/revenue/payouts`, { timeout: 60_000 });
        await wait(700);
        goToPayout(GroupPage);
        await wait(700);

        await GroupPage.waitForSelector('button.btn-secondary-md.add-payout-recipient-button.ng-binding', { visible: true, enabled: true });
        await GroupPage.click('button.btn-secondary-md.add-payout-recipient-button.ng-binding');

        typeUsername(GroupPage, username);
        await wait(2500);
      
        clickUserWithUsername(GroupPage, username);
        await wait(2500);
      
        clickElementWithOK(GroupPage);
        await wait(1400);
      
        writeAmountToInput(GroupPage, amount).catch(e => null);
        await wait(1500);

        const { Button, isDisabled } = await findButtonByText(GroupPage, 'Distribute');

        if (Button) {
            if (isDisabled) {
                rej({ code: 8, error: true, message: "User didnt completed 14 day in the group" });
                return GroupPage.close();
            };
            await Button.click();
            console.log('Button "Distribute" clicked successfully.');
        } else {
            rej('Button "Distribute" not found.');
        };

        let verificationCode = null;
        let attempts = 0;

        while (!verificationCode && attempts < 60) { // Try for up to 60 seconds (1 minute)
            await wait(10_000);
            const isHidden = await checkAriaHiddenById(GroupPage, 'generic-challenge-container');

            if (isHidden) {
                const { message, done } = await mail();

                if (message.includes(client.me.username)) {
                    const codeRegExp = /\b(\d{6})\b/;
                    const match = message.match(codeRegExp);
                    if (match && match[1]) {
                        verificationCode = match[1];
                        break;
                    } else {
                        console.log('Unable to extract the verification code from the message:', message);
                    }
                } else {
                    console.log('Message does not contain the 2-Step Verification Code or does not include the username.');
                }

            } else {
                // GroupPage.close()
                res({ done: true, code: false })
                break;
            }

            attempts++;
            await wait(5000);
        }

        if (verificationCode) {
            console.log('Proceeding with the verification process using the obtained code...');
            const codeInput = await GroupPage.$('input[id="two-step-verification-code-input"]');
            const confirmButton = await GroupPage.$('button[class="btn-cta-md modal-modern-footer-button"]');

            codeInput.type(verificationCode);
            await wait(2000);
            confirmButton.click();
            await wait(2000);

            // GroupPage.close().catch(e => 404);
            res({ done: true, code: true })
        };
    })


};

module.exports = Payout;