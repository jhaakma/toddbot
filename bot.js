var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
var responses = [
    "It just works!™️",
    "Yes, I was in the chess club.",
    "Sixteen times the detail!",
    "See that mountain? you can climb it!",
    "I am Todd Howard -- T-O-D-D H-O-W-A-R-D.",
    "These NPCs are not scripted!",
    "Sometimes, it just doesn't work."
]

bot.on('message', function (user, userID, channelID, message, evt) {

    if ( user != bot.username ) {

        if (message.toLowerCase().includes("todd howard") ) {
            var response = responses[Math.floor(Math.random() * responses.length)]
            bot.sendMessage({
                to: channelID,
                message: response
            });
        } 
        else if (message.toLowerCase().includes("it just works") ) {
            var response = responses[Math.floor(Math.random() * responses.length)]
            bot.sendMessage({
                to: channelID,
                message: "Sometimes, it just doesn't work."
            });
        }

        else if (message.toLowerCase().includes("tod howard") ) {
            var response = responses[Math.floor(Math.random() * responses.length)]
            bot.sendMessage({
                to: channelID,
                message: "I am Todd Howard -- T-O-D-D H-O-W-A-R-D."
            });
        }
    }
});
