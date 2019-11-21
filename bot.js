var Discord = require('discord.js');
var auth = require('./auth.json');
var replies = require('./replies.json')
var logger = require('./logger')
logger.setLogLevel("DEBUG")

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
function startsWith(message, pattern) {
    return message.content.toLowerCase().startsWith(pattern)
}
function sendReply(message, reply) {
    //handle special logic of replies as commands
    if (reply.startsWith('`')) {
        message.channel.send(eval(reply))
    } else {
        message.channel.send(reply)    
    }
}

function doCommand(message) {
    //Commands
    if (message.content.substring(0, 1) == '?') {
        var args = message.content.substring(1).split(' ');
        var thisCommand = args[0].toLowerCase();
        const user = message.mentions.users.first()
        if ( user ) {
            for ( command in replies.commands ) {
                if (command == thisCommand) {
                    replies.commands[command].forEach( function(reply){
                        if (reply.startsWith('`')) {
                            message.channel.send(eval(reply))
                        } else {
                            message.channel.send(reply)    
                        }
                        return true
                    })
                    logger.debug("Did command: %s", command)
                }
            }
        }
    }
    return false
}

function doReplyText(message) {
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
        return true
    }
    return false
}

function doReplyEmoji(message) {
        //Check prompts for reactions
        for ( prompt in replies.emojiReplies ) {
            if ( hasText(message, prompt ) ) {
                replies.emojiReplies[prompt].forEach( function(emoji) {
                    message.react(emoji)
                })
            }
        }
}

client.on('message', message => {
    var validMessage = (
        message.author.username != client.user.username
    )

    if ( validMessage ) {
        const didCommand = doCommand(message)
        if ( didCommand == false ) {
            doReplyText(message)
            doReplyEmoji(message)
        }
    }
});

client.on('guildMemberUpdate', function(oldMember, newMember){
    const oldRoles = oldMember.roles
    const newRoles = newMember.roles

    
    if (oldRoles.size != newRoles.size) {
        var oldRoleNames = []
        var newRoleNames = []
        oldRoles.forEach( function(role) {
            oldRoleNames.push(role)
        })
        newRoles.forEach( function(role) {
            newRoleNames.push(role)
        })

        //Role removed
        if ( oldRoleNames.length > newRoleNames.length ) {
            for ( var i in oldRoleNames ) {
                if ( newRoleNames.includes(oldRoleNames[i]) == false ) {
                    logger.debug("%s was removed from %s", oldRoleNames[i].name, oldMember.displayName)
                }
            }
        }
        //Role added
        if ( newRoleNames.length > oldRoleNames.length ) {
            for ( var i in newRoleNames ) {
                if ( oldRoleNames.includes(newRoleNames[i]) == false ) {
                    logger.debug("%s was added to %s", newRoleNames[i].name, oldMember.displayName)
                }
            }
        }
    }
})


client.login(auth.token);