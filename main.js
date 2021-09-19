const Discord = require('discord.js')
const fs = require('fs')

const config = require('./config.json')
const {updateWatcher} = require('./website_update_module.js')

const bot = new Discord.Client()

bot.on("ready", () => {
        console.log(`Logged in as ${bot.user.tag}`)

        const guilds = bot.guilds.cache

        updateWatcher(guilds)

});




bot.login(config.token)

