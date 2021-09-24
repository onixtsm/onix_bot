const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')

const config = require('./config.json')
const {prefix} = require('./settings.json')
const {updateWatcher} = require('./modules/website_update_module.js')
const {helpListener, getDescription} = require('./help')

const bot = new Discord.Client()

bot.on("ready", async () => {
        console.log(`Logged in as ${bot.user.tag}`)




        // Import commands
        const baseFile = 'Icommand.js'
        const commandBase = require(`./commands/${baseFile}`)

        const readCommands = (dir) => {
                const files = fs.readdirSync(path.join(__dirname, dir))
                for (const file of files) {
                        const stat = fs.lstatSync(path.join(__dirname, dir, file))
                        if (stat.isDirectory()) {
                                readCommands(path.join(dir, file))
                        } else if (file !== baseFile) {
                                const option = require(path.join(__dirname, dir, file))
                                getDescription(option)
                                commandBase(bot, option)
                        }
                }
        }

        readCommands('commands')

        helpListener(bot)





        bot.user.setActivity(`${prefix}help`, {type: 'LISTENING'})






        const guilds = bot.guilds.cache

        updateWatcher(guilds)

})




bot.login(config.token)

