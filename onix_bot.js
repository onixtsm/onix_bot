const Discord = require('discord.js');
const fs = require('fs')

const config = require('./config.json')

const bot = new Discord.Client();

bot.on("ready", () => {
        console.log(`Logged in as ${bot.user.tag}`);

        const guild = bot.guilds.cache.get(config.test_id); //cuties
        const general_text = bot.channels.cache.get(config.test_id); //general

        fs.watchFile('/home/onix/current', () => {
                try {
                        general_text.send("**Iečekojiet jauno apdeitu** https://www.onixtsm.org");
                } catch (error) {
                        date = new Date
                        fs.appendFile('./bot.log', date + ' ' + error.toString() + '\n', (err) => {
                                if (err) throw err;
                                console.log('saved');
                        });
                }
        });

});




bot.login(config.token)

