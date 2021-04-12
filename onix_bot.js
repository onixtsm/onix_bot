const Discord = require('discord.js');
const fs = require('fs')

const config = require('./config.json')

const bot = new Discord.Client();

bot.on("ready", () => {
        console.log(`Logged in as ${bot.user.tag}`);

        const guild = bot.guilds.cache.get(config.cutie_squad_id); //cuties
        const general_text = bot.channels.cache.get(config.cuties_sqad_general_id); //general

        fs.watchFile('/home/deploy/avocado/current', () => {
                try {
                        general_text.send("**@everyone, iečekojiet jauno apdeitu** https://www.onixtsm.org");
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

