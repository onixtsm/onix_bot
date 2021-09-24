const {shot} = require('../../modules/russian_roulette_module')
const {forgot_to_shuffle, he_died, you_died, lucky} = require('../../settings.json')

let daringOnes = {}

module.exports = {
        commands: ['shot'],
        description: 'Izmanto lai šaut sev',
        callback: (message) => {

                response = shot()
                id = message.author.id

               if (id in daringOnes) {
                       daringOnes[id]++
               } else {
                       daringOnes[id] = 0
               }

                if(response === -1) {
                        let phrase = forgot_to_shuffle[Math.floor(Math.random() * forgot_to_shuffle.length)]
                        message.channel.send(phrase)
                } else if (response) {

                        let phrase = he_died[Math.floor(Math.random() * he_died.length)]
                        let kick_phrase = you_died[Math.floor(Math.random() * you_died.length)]
                        message.member.kick({
                                reason: kick_phrase
                        })
                                .then(message.channel.send(`@${message.author.username}\n${phrase}`))
                                .catch(err => {
                                        message.channel.send("Wait, kā viņš izdzīvoja???")
                                        console.log(err)
                                })
                                
                } else {
                        let phrase = lucky[Math.floor(Math.random() * lucky.length)]
                        message.channel.send(`@${message.author.username}\n${phrase}`)
                }


        }
}
