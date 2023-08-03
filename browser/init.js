const puppeteer = require("puppeteer");
const options = require("./options.js")
const args = require("./args.js");

const browser = puppeteer.launch({
    ...options,
    args
});

module.exports = browser
