// Help module
//
//
//

const {prefix} = require('../settings.json')
const {getCommands} = require('../modules/messageListener_module')

module.exports = {
        commands: ['help', 'h'],
        maxArgs: 1,
        expectedArgs: '[komanda]',
        description: 'Parādo šo palīdzības ziņu, vai arī konkrētai komandai',
        usage: `${prefix}help|h [komanda]`,

        callback: (message, arguments) => {


                let options = getCommands()

                let helpMessage = '``` PALĪDZĪBA IR KLĀT\n'

                if (arguments.length) {
                        for (let i = 0; i < arguments.length; i++) {
                                if (options[i].commands[0] === arguments[0]) {
                                        // one line fix. Other way line 34 forEach doesn't work
                                        options = [options[i]]
                                        break
                                }
                        }
                }

                options.forEach(c => {
                        if (c.hidden) {
                                return
                        }
                        helpMessage += c.commands.toString().replace(/\,/g, '|')
                        helpMessage += ' ' + c.expectedArgs
                        helpMessage += ` - ${c.description}\n`
                })

                helpMessage+='```'

                message.channel.send(helpMessage)

              
                
        }
        
}



/*
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
        */
