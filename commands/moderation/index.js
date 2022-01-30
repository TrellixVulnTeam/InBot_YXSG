let moment = require("moment");
let chalk = require("chalk");
function ban() {
  return require("./ban/ban.js");
}
function config() {
  return require("./config/config.js");
}
function modlog() {
  return require("./modlog/modlog.js");
}
function unban() {
  return require("./unban/unban.js");
}

function scan() {
  return require("./scan/scan.js");
}

function testingenv() {
  return require("./testingenv/testingenv.js");
}

module.exports = {
  testingenv,
  scan,
  ban,
  config,
  modlog,
  unban,
};
console.log(
  chalk.white.bold("[" + moment().format("M/D/y HH:mm:ss") + "] [MODULE] ") +
    "[I] Category MODERATION loaded"
);
