var Discord = require('discord.js');
var auth = require('./auth.json');
var logger = require('./logger')
//logger.setLogLevel("DEBUG")

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

var replies = {
    "it just works": "Sometimes, it doesn't just work.",
    "tod howard": "I am Todd Howard -- T-O-D-D H-O-W-A-R-D.",
    "tell me lies": "Tell me sweet little lies..."
}

var emojiReplies = {
    "excited": [":excited:481404244239581205"],
    "free the crab": [":banhammer:537248733155295243", "🦀"],
    "caius cosades": [":sexy:527994270880235539"],
    "feature creep": [":creeper:534834891704238112"],
    "facepalm": [":facepalm:541813012063846402"],
}

client.on('message', message => {
    var validMessage = (
        message.author.username != client.user.username //&&
        //message.channel.parent.name == "General Talk"
    )

    if ( validMessage ) {
        var response

        //Default
        if ( hasText(message, "todd howard") ) {
            response = getDefaultResponse()
        }
        //Check prompts for replies
        else {
            for ( prompt in replies ) {
                if ( hasText(message, prompt) ) {
                    response = replies[prompt]
                    break
                }
            }
        }
        //Respond
        if ( response != null ) {
            message.channel.send(response)
            logger.debug("Response sent\n\tChannel: %s\n\tMessage: %s", message.channel.name, response)
        }

        //Check prompts for reactions
        for ( prompt in emojiReplies ) {
            if ( hasText(message, prompt ) ) {
                emojiReplies[prompt].forEach( function(emoji) {
                    message.react(emoji)
                })
            }
        }
    }
});

client.login(auth.token);