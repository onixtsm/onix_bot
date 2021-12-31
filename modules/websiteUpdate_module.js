const fs = require('fs')
const {path} = require('../config.json')
const {names, update_phrase} = require('../settings.json')


updateWatcher = (guilds) => {

        fsTimeout = setTimeout(() => {fsTimeout = undefined}, 30 * 1000)

        fs.watch(path, () => {
                if (!fsTimeout) {
                        guilds.each(guild => sendMessige(guild))
                }
        })
}

sendMessige = (guild) => {
        let channel = guild.channels.cache.find((ch) => findMainChannel(ch))

        let phrase = update_phrase[Math.floor(Math.random() * update_phrase.length)]
        channel.send(`**${phrase}**\nhttps://www.onixtsm.org`)


}



findMainChannel = (channel) => {
        for (i = 0; i < names.length; i++) {
                if (channel.name.toLowerCase() === names[i]) {
                        return channel
                }
        }
}

module.exports = {
        updateWatcher
}
