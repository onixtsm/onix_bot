const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')

const config = require('./config.json')
const {prefix} = require('./settings.json')

const listenerInstance = require('./modules/message_listener_module')

const {updateWatcher} = require('./modules/website_update_module.js')

const bot = new Discord.Client()

bot.on("ready", async () => {
        console.log(`Logged in as ${bot.user.tag}`)


        bot.user.setActivity(`${prefix}help`, {type: 'LISTENING'})



        const guilds = bot.guilds.cache

        // Import commands
        const baseFile = 'Icommand.js'
        const defaultOption = require(`./commands/${baseFile}`)


        listenerInstance.messageListener(bot)

        const readCommands = (dir) => {
                const files = fs.readdirSync(path.join(__dirname, dir))
                for (const file of files) {
                        if (file.name === baseFile) {
                                continue
                        }
                        const stat = fs.lstatSync(path.join(__dirname, dir, file))
                        if (stat.isDirectory()) {
                                readCommands(path.join(dir, file))
                        } else if (file !== baseFile) {
                                let option = {...defaultOption, ...require(path.join(__dirname, dir, file))}
                                defaultOption.validate(option)
                                delete option.validate

                                listenerInstance.addCommand(option)


                        }
                }

        }




        readCommands('commands')
        //helpListener(bot)
        updateWatcher(guilds)

})




bot.login(config.token)

