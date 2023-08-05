const WebSocket = require("ws");
const Login = require("./auth/roblox/login.js");
const Payout = require("./auth/roblox/controllers/payout.js")
const { gateway, username, password } = require("./config/config.json");

let Page = null
let Client = null;

if (!gateway || !password) throw new Error("Invalid gateway url or missing (username | password)");

async function main() {
  require("./auth/google.js");

  const browser = await (require("./browser/init.js"));
  const page = await browser.newPage();
  await page.goto('https://roblox.com/login', { timeout: 60_0000 });

  return await Login(page, username, password).then((zoblox) => {
    console.log(`Successfully loged as ${zoblox.me.username}`);
    return { client: zoblox, page }
  });

};

const ws = new WebSocket('wss://gateway-roblox.glitch.me/', {
  headers: {
    'User-Agent': 'Your User Agent String Here'
  }
});

ws.on('error', console.error);

ws.on('open', async (socket) => {
  console.log("Connected to gateway successfully");
  const { client, page } = await main();
  Page = page;
  Client = client;
  ws.send(JSON.stringify({ user: client.me }))
});


ws.on('message', (payload) => {
  const message = JSON.parse(payload);
  console.log(message)


  if (message.op === 'transfer') {
    const { username: user, amount, id, groupId } = message;
    if (!user || !amount || !id || !groupId) return ws.send(JSON.stringify({ op: 'transfer', error: true, message: 'Missing (id | username | amount | groupId)', id }));

    Payout(Client, Page, user, groupId, amount).then(() => {
      ws.send(JSON.stringify({ op: 'transfer', id, done: true }))
    }).catch((message) => {
      ws.send(JSON.stringify({ op: 'transfer', id, done: false, error: true, data: message }));
    });

  };

});

ws.on('close', () => {
  process.kill(1)
});

process.on('unhandledRejection', (err) => console.error(err));
