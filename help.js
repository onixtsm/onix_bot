// Help module
//
//
//

const {prefix} = require('./settings.json')


let helpMessages = {
        help: "Shows this help messige"
}
const getDescription = (options) => {
        if (options.hidden) {
                return
        }
        helpMessages[options.commands[0]] = options.description
}

const giveDescription = (name) => {
        if (name) {
                return {
                        [name]: helpMessages[name]

                }
        }
        return helpMessages
}

const helpListener = (bot) => {
        bot.on('message', (message) => {
                const {member, content, guild} = message

                if (content.toLowerCase().startsWith(`${prefix}help`) || content.toLowerCase().startsWith(`${prefix}h`)) {

                        const arguments = content.split(/[ ]+/)
                        arguments.shift()

                        let descriptions = giveDescription(arguments[0])

                        let helpMessage = '```'

                        Object.entries(descriptions).forEach(([name, desc]) => {
                                helpMessage += `${prefix}${name} - ${desc}\n`
                                
                        })
                        helpMessage += '```'

                        message.channel.send(helpMessage)

                }
        })
}

module.exports = {
        helpListener,
        getDescription
}
