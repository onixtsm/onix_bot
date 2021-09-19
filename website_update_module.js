const fs = require('fs')
const {names, update_phrase} = require('./settings.json')


updateWatcher = (guilds) => {
        fs.watchFile('/home/onix/works/js/onix_bot/test', () => { ///home/deploy/avocado/current
                guilds.each(guild => sendMessige(guild))
        })
}

sendMessige = (guild) => {
        let channel = guild.channels.cache.find((ch) => findMainChannel(ch))

        let phrase = update_phrase[Math.floor(Math.random() * update_phrase.length)]
        channel.send(`**@everyone, ${phrase}**\nhttps://www.onixtsm.org`)


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
