var Discord = require('discord.js');
var auth = require('./auth.json');
var replies = require('./replies.json')
var logger = require('./logger')
//logger.setLogLevel("DEBUG")

// Initialize Discord client
var client = new Discord.Client();
client.on('ready', function (evt) {
    logger.info('Logged in as %s', client.user.tag)
});

//helper functions
function getDefaultReply() {
    return replies.defaultReplies[Math.floor(Math.random() * replies.defaultReplies.length)]
}
function hasText(message, pattern) {
    return message.content.toLowerCase().includes(pattern)
}
function sendReply(message, reply) {
    //handle special logic of replies as commands
    if (reply.startsWith('`')) {
        message.channel.send(eval(reply))
    } else {
        message.channel.send(reply)    
    }
}

client.on('message', message => {
    var validMessage = (
        message.author.username != client.user.username
    )

    if ( validMessage ) {
        var response
        //Default
        if ( hasText(message, "todd howard") ) {
            response = getDefaultReply()
        }
        //Check prompts for replies
        else {
            for ( prompt in replies.textReplies ) {
                if ( hasText(message, prompt) ) {
                    response = replies.textReplies[prompt]
                    break
                }
            }
        }
        //Respond
        if ( response != null ) {
            response.forEach( function(reply) {
                sendReply(message, reply)
                logger.debug("Response sent\n\tChannel: %s\n\tMessage: %s", message.channel.name, reply)
            })
        }

        //Check prompts for reactions
        for ( prompt in replies.emojiReplies ) {
            if ( hasText(message, prompt ) ) {
                replies.emojiReplies[prompt].forEach( function(emoji) {
                    message.react(emoji)
                })
            }
        }
    }
});

client.login(auth.token);