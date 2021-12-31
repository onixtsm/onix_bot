const Minesweeper = require('../modules/minesweeper_module')

module.exports = {
  commands: ['minesweeper', 'ms'],
  maxArgs: 1,
  minArgs: 1,
  expectedArgs: '<beginner|medium|hard>',
  description: 'Saprieris Diskordā',

  callback: (message, args) => {

    
    // Levels: [side, mineCount]
    const levels = {
      "beginner": [9, 10],
      "medium": [16, 40],
      "hard": [24, 99]
    }

    let level = levels?.[args]
    if (!level) {
      message.channel.send('Nepareizs grūtības modifikātors')
      return
    }

    Minesweeper.Play(level, message)

     



    //message.channel.send({ embeds: [exampleEmbed] });
    


  }
}
