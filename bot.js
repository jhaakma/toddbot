var Discord = require('discord.js');
var replies = require('./replies.json')
var dotenv = require('dotenv')
var logger = require('./logger')
logger.setLogLevel("DEBUG")
dotenv.config()
var express = require('express');
var app = express()
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Listening on port', port);
});


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


var shutupUntilTime = 0
function shutup(minutes) {
    var date = new Date()
    shutupUntilTime = date.getTime() + ( minutes * 1000 * 60 )
    logger.info("Shutting up until %s", shutupUntilTime)
    return ""
}

var reminders = {}
function remindMe(user, args) {
    if ( args.length < 4 ) { return "invalid" }
    const timeFromNow = args[1]
    const timeType = args[2]
    var messageToSend = ""
    for ( var i = 3; i < args.length; i++ ) {
        messageToSend = messageToSend + " " + args[i]
    }

    if (  isNaN(timeFromNow) ) {
        return ""
    }
    var date = new Date()
    var now = date.getTime()
    var time
    if ( timeType == "hours" || timeType == "hour" ) {
        time = now + (timeFromNow * 60 * 60 * 1000 )
    }else if ( timeType == "minutes" || timeType == "minute" ) {
        time = now + (timeFromNow * 60 * 1000 )
    } else if ( timeType == "seconds" || timeType == "second" ) {
        time = now + (timeFromNow * 1000 )
    } else {
        return ""
    }
    
    reminders[user.id] = { time: time, message: messageToSend }
    return eval("`Sure thing ${user.username}, I will remind you in ${timeFromNow} ${timeType}!`")
}

function sendReply(message, reply, args) {
    //handle special logic of replies as commands
    if (reply.startsWith('`')) {
        const replyText = eval(reply)
        if ( replyText != "" ) {
            message.channel.send(replyText)
        }
    } else {
        message.channel.send(reply)    
    }
}


client.setInterval(checkRemindMe, 1000)
function checkRemindMe() {
    var date = new Date()
    var now = date.getTime()
    for (userId in reminders) {
        if ( now > reminders[userId].time) {
            var message = reminders[userId].message
            delete reminders[userId]
            client.fetchUser(userId)
            .then( user => {
                user.createDM()
                .then( dm => {
                    dm.send("Here's your reminder: " + message)
                })
            })
        }
    }
}

function doCommand(message) {
    //Commands
    if (message.content.substring(0, 1) == '?') {
        var args = message.content.substring(1).split(' ');
        var thisCommand = args[0].toLowerCase();

        for ( command in replies.commands ) {
            if (command == thisCommand) {
                replies.commands[command].forEach( function(reply){
                    sendReply(message, reply, args)
                    return
                })
                logger.info("Did command: %s", command)
                return true
            }
        }
    }
    return false
}

function doReplyText(message) {
    logger.debug("entering doReplyText")
    function execute(list) {
        //full prompts first
        for ( prompt in list.full ) {
            if ( message.content.toLowerCase() == prompt) {
                logger.debug( "full: %s", list.full[prompt])
                return list.full[prompt]
            }
        }
        //partial prompts
        for ( prompt in list.partial ) {
            if ( hasText(message, prompt) ) {
                logger.debug("partial: %s", list.partial[prompt])
                return list.partial[prompt]
            }
        }
        return false
    }

    var response

    //User specific
    for ( userTag in replies.userReplies ) {
        if ( message.author.tag == userTag ) {
            logger.debug("matched %s", userTag)
            response = execute(replies.userReplies[userTag])
        }
    }
    //Generic
    if ( !response ) {
        logger.debug("Checking generic")
        response = execute(replies.textReplies)
    }

    //Respond
    if ( response ) {
        response.forEach( function(reply) {
            sendReply(message, reply)
            logger.info("Response sent\n\tChannel: %s\n\tMessage: %s", message.channel.name, reply)
        })
        return true
    }
    return false
}

function doReplyEmoji(message) {
    //full prompts
    for ( prompt in replies.emojiReplies.full ) {
        if ( hasText(message, prompt ) ) {
            replies.emojiReplies.full[prompt].forEach( function(emoji) {
                message.react(emoji).then().catch(function(err) { logger.error(err)})
            })
        }
    }
    //partial prompts
    for ( prompt in replies.emojiReplies.partial ) {
        if ( hasText(message, prompt ) ) {
            replies.emojiReplies.partial [prompt].forEach( function(emoji) {
                message.react(emoji).then().catch(function(err) { logger.error(err)})
            })
        }
    }
}

//Events

client.on('message', message => {
    var date = new Date()

    var notBot = ( message.author.username != client.user.username)
    var validChannel = ( message.channel.name == "general" 
        || message.channel.name == "chim" )
    var notSilenced = ( date.getTime() > shutupUntilTime )

    logger.debug("notBot %s",notBot)
    logger.debug("validChannel %s",validChannel)
    logger.debug("notSilenced %s",notSilenced)

    if ( notBot ) {
        var didCommand = doCommand(message)
        if ( 
            didCommand == false 
            && validChannel
            && notSilenced
        ) {
            doReplyText(message)
            doReplyEmoji(message)
        }
    }

});

// client.on('guildMemberUpdate', function(oldMember, newMember){
//     const oldRoles = oldMember.roles
//     const newRoles = newMember.roles

    
//     if (oldRoles.size != newRoles.size) {
//         var oldRoleNames = []
//         var newRoleNames = []
//         oldRoles.forEach( function(role) {
//             oldRoleNames.push(role)
//         })
//         newRoles.forEach( function(role) {
//             newRoleNames.push(role)
//         })

//         //Role removed
//         if ( oldRoleNames.length > newRoleNames.length ) {
//             for ( var i in oldRoleNames ) {
//                 if ( newRoleNames.includes(oldRoleNames[i]) == false ) {
//                     logger.debug("%s was removed from %s", oldRoleNames[i].name, oldMember.displayName)


//                     logger.debug(oldMember.id)
//                     if (oldRoleNames[i].name == "Lurker" && oldMember.user.tag == "Dylan#8987" ) {
//                         const channel = oldMember.guild.channels.find(ch => ch.name === 'testroom')
//                         channel.send("Adding TDM back to Lurker role!")
//                         newMember.addRole("Lurker")
//                     }

//                 }
//             }
//         }
//         //Role added
//         if ( newRoleNames.length > oldRoleNames.length ) {
//             for ( var i in newRoleNames ) {
//                 if ( oldRoleNames.includes(newRoleNames[i]) == false ) {
//                     logger.debug("%s was added to %s", newRoleNames[i].name, oldMember.displayName)
//                 }
//             }
//         }
//     }
// })

var token = process.env.TOKEN
logger.debug("token: %s", token)
client.login(token);
