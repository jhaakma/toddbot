var Discord = require('discord.js');
var auth = require('./auth.json');
var logger = require('./logger')

logger.setLogLevel("DEBUG")
// Initialize Discord client
var client = new Discord.Client();
client.on('ready', function (evt) {
    logger.info('Logged in as %s', client.user.tag)
});

var responses = [
    "It just works!™️",
    "Yes, I was in the chess club.",
    "Sixteen times the detail!",
    "See that mountain? you can climb it!",
    "I am Todd Howard -- T-O-D-D H-O-W-A-R-D.",
    "These NPCs are not scripted!",
    "Sometimes, it doesn't just work."
]
function getDefaultResponse() {
    return responses[Math.floor(Math.random() * responses.length)]
}

function hasText(message, pattern) {
    return message.content.toLowerCase().includes(pattern)
}

function isText(message, text) {
    return message.content.toLowerCase === text
}

var commands = {

}

client.on('message', message => {
    var validMessage = (
        message.author.username != client.user.username //&&
        //message.channel.parent.name == "General Talk"
    )

    if ( validMessage ) {
        var response
        //Todd Howard
        if ( hasText(message, "todd howard") ) {
            response = getDefaultResponse()
        }
        //It just works!
        else if ( hasText(message, "it just works") ) {
            response = "Sometimes, it doesn't just work."
        }
        //Misspelling Tod
        else if ( hasText(message, "tod howard") ) {
            response = "I am Todd Howard -- T-O-D-D H-O-W-A-R-D."
        }

        //Misspelling Tod
        else if ( hasText(message, "tell me lies") ) {
            response = "Tell me sweet little lies..."
        }

        //Respond
        if ( response != null ) {
            message.channel.send(response)
        }

        //REACTIONS

        //Excited
        if ( hasText(message, "excited") ) {
            message.react(":excited:481404244239581205").then().catch(console.error)
        }
        //Ban the crab
        if ( hasText(message, "free the crab" ) ) {
            message.react(":banhammer:537248733155295243")
            message.react("🦀")
        }

        //Caius Cosades
        if ( hasText(message, "caius cosades" ) ) {
            message.react(":sexy:527994270880235539")
        }

        //Feaure creep
        if ( hasText(message, "feature creep") ) {
            message.react(":creeper:534834891704238112")
        }

        //Facepalm
        if ( hasText(message, "facepalm") ) {
            message.react(":facepalm:541813012063846402")
        }
    } else {
        logger.debug("'%s' Not valid message", message.content)
    }
});

client.login(auth.token);