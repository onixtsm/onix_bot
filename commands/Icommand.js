const {prefix} = require('../settings.json')



const validatePermissions = (permissions) => {
        const validPermission = [
                'CREATE_INSTANT_INVITE',
                'KICK_MEMBERS',
                'BAN_MEMBERS',
                'ADMINISTRATOR',
                'MANAGE_CHANNELS',
                'MANAGE_GUILD',
                'ADD_REACTIONS',
                'VIEW_AUDIT_LOG',
                'PRIORITY_SPEAKER',
                'STREAM',
                'VIEW_CHANNEL',
                'SEND_MESSAGES',
                'SEND_TTS_MESSAGES',
                'MANAGE_MESSAGES',
                'EMBED_LINKS',
                'ATTACH_FILES',
                'READ_MESSAGE_HISTORY',
                'MENTION_EVERYONE',
                'USE_EXTERNAL_EMOJIS',
                'VIEW_GUILD_INSIGHTS',
                'CONNECT',
                'SPEAK',
                'MUTE_MEMBERS',
                'DEAFEN_MEMBERS',
                'MOVE_MEMBERS',
                'USE_VAD',
                'CHANGE_NICKNAME',
                'MANAGE_NICKNAMES',
                'MANAGE_ROLES',
                'MANAGE_WEBHOOKS',
                'MANAGE_EMOJIS_AND_STICKERS',
                'USE_APPLICATION_COMMANDS',
                'REQUEST_TO_SPEAK',
                'MANAGE_THREADS',
                'USE_PUBLIC_THREADS',
                'USE_PRIVATE_THREADS',
                'USE_EXTERNAL_STICKERS',
        ]

        for (const permission of permissions) {
                if (!validPermission.includes(permission)) {
                        throw new Error(`Bad permission "${permission}"`)
                }
        }
}



module.exports = (bot, commandOptions) => {
        let {
                commands,
                description = '',
                expectedArgs = '',
                permissionError = 'Tev nav tiesību šo darīt',
                minArgs = 0,
                maxArgs = null,
                permissions = [],
                requiredRoles = [],
                hidden = false,
                callable = true,
                callback

        } = commandOptions


        

        // Make string into arrays
        if (typeof commands === 'string') {
                commands = [commands]
        }

        // Validate permissions
        if (permissions.length) {
                if (typeof permissions === 'string') {
                        permissions = [permissions]
                }

                validatePermissions(permissions)
        }
        var error = 0

        bot.on('message', (message) => {
                const {member, content, guild} = message

                for (const alias of commands) {
                        if (content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {

                                if (!callable) {
                                        console.log(`${alias} is not callable`)
                                        return
                                }



                                for (const permission of permissions) {
                                        if (!member.hasPermission(permission)) {
                                                message.reply(permissionError)
                                                error = 1
                                                return
                                        }
                                }

                                for (const requiredRole of requiredRoles) {
                                        const role = guild.roles.cache.find(role => role.name === requiredRole)

                                        if (!role || !member.roles.cache.has(role.id)) {
                                                message.reply(`Tev jābūt šim rolam ${requiredRole}`)
                                                error = 2
                                                return
                                        }
                                }

                                const arguments = content.split(/[ ]+/)
                                arguments.shift()

                                if (arguments.length < minArgs || (
                                        maxArgs !== null && arguments.length > maxArgs
                                )) {
                                        message.reply(`Nepareiza sintakse! Lieto ${prefix}${alias} ${expectedArgs}`)
                                        error = 3

                                }


                                callback(message, arguments, arguments.join(' '))
                                return
                        }
                }
        })
}
