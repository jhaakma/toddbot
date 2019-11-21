var chalk = require('chalk');
var logLevels = {
    'DEBUG': 1,
    'INFO': 2,
    'ERROR': 3,
    'NONE': 4
}
var color = {
    'DEBUG': chalk.white,
    'INFO': chalk.green,
    'ERROR': chalk.red,
}

var currentLogLevel = logLevels.INFO

function doLog(logLevel) {
    return currentLogLevel <= logLevel
}

function log(logLevel, message, args) {
    if ( doLog(logLevels[logLevel]) ) {
        console.log(color[logLevel]("[" + logLevel +"]" + message), ...args)
    }
}

//Exported functions:
function setLogLevel(newLogLevel) {
    currentLogLevel = logLevels[newLogLevel]
}

function debug(message, ...args) {
    log("DEBUG", message, args)
}

function info(message, ...args) {
    log("INFO", message, args)
}

function error(message, ...args) {
    log("ERROR", message, args)
}

module.exports = { debug, info, error, setLogLevel }