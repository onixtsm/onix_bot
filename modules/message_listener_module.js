const {prefix} = require('../settings.json')

const commands = []

let messageListener = (bot) => {
        bot.on('message', message => onMessage(message))
}

let onMessage = (message) => {

        if (message.author.bot) {
                return
        }

        const {content, member, guild} = message


        commands.forEach((obj) => {

                for (let i = 0; i < obj.commands.length; i++) {
                        if (content.toLowerCase().startsWith(`${prefix}${obj.commands[i].toLowerCase()}`)) {

                                if (!obj.callable) {
                                        return
                                }
                                for (const permission of obj.permissions) {
                                        if (!member.hasPermission(permission)) {
                                                message.reply(permissionError)
                                                return
                                        }
                                }


                                for (const requiredRole of obj.requiredRoles) {
                                        const role = guild.roles.cache.find(role => role.name === requiredRole)

                                        if (!role || !member.roles.cache.has(role.id)) {
                                                message.reply(`Tev jābūt šim rolam ${requiredRole}`)
                                                return
                                        }
                                }

                                const arguments = content.split(/[ ]+/)
                                arguments.shift()

                                if (arguments.length < obj.minArgs || (
                                        obj.maxArgs !== null && arguments.length > obj.maxArgs
                                )) {
                                        message.channel.send(`Nepareiza sintakse! Lieto ${prefix}${obj.commands[0]} ${obj.expectedArgs}`)
                                        return

                                }

                                obj.callback(message, arguments, arguments.join(' '))
                                return
                        }
                }
        })
}


let addCommand = (options) => {
        commands.push(options)

}

let getCommands = () => {
        return commands
}

module.exports = {
        messageListener,
        addCommand,
        getCommands
}

