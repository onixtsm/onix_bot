const {shuffle} = require('../../modules/russian_roulette_module')
const {shuffled} = require('../../settings.json')

module.exports = {
        commands: ['shuffle'],
        description: 'Iegriež veltni',
        callback: (message) => {

                let phrase = shuffled[Math.floor(Math.random() * shuffled.length)]
                shuffle()
                message.channel.send(phrase)


        }
}
