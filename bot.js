var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord client\
var client = new Discord.Client();
client.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as ${client.user.tag}!');
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

client.on('message', message => {
    logger.info("message recieved")
    if ( message.author.username != client.user.username ) {
        
        if (message.content.toLowerCase().includes("todd howard") ) {
            logger.info("Found message: todd howard")
            var response = responses[Math.floor(Math.random() * responses.length)]
            message.channel.send(response)
        } 
        else if (message.content.toLowerCase().includes("it just works") ) {
            var response = responses[Math.floor(Math.random() * responses.length)]
            message.channel.send("Sometimes, it just doesn't work.")

        }

        else if (message.content.toLowerCase().includes("tod howard") ) {
            var response = responses[Math.floor(Math.random() * responses.length)]
            message.channel.send("I am Todd Howard -- T-O-D-D H-O-W-A-R-D.")
        }
    }
});

client.login(auth.token);