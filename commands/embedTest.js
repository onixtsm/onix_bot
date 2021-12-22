const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const  Minesweeper = require('../modules/minesweeper_module')

module.exports = {
  commands: ['test'],
  description: 'Izmanto lai šaut sev',

  callback: async (message) => {

    
    // Levels: [side, mineCount]
    const levels = {
      "beginner": [9, 10],
      "medium": [16, 40],
      "hard": [24, 99]
    }

    let level = levels.beginner

    field = Minesweeper.Generate(level)

    let output = '```\n'
    for (let i = 0; i < level[0]; i++) {
      for (let j = 0; j < level[0]; j++ ) {
        if (field[i][j].HIDDEN) {
          output += '.'
        } else {
          field[i][j].MINE ? output += '*' : output += field[i][j].NUMBER
        }


      }
      output += '\n'
    }
    output += '```'
    
    const exampleEmbed = new MessageEmbed()
    .setTitle('Minesweeper')
    .addField('Field', output, true)
    
    const controls = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('left')
          .setEmoji('⬅️')
          .setStyle('SECONDARY')
      )
      .addComponents(
        new MessageButton()
          .setCustomId('right')
          .setEmoji('⬆️')
          .setStyle('SECONDARY')
      )
      .addComponents(
        new MessageButton()
          .setCustomId('up')
          .setEmoji('⬆️')
          .setStyle('SECONDARY')
      )
      .addComponents(
        new MessageButton()
          .setCustomId('down')
          .setEmoji('⬇️')
          .setStyle('SECONDARY')
      )
    await message.channel.send({
      embeds: [exampleEmbed],
      components: [controls]
    })

    const filter = (btnInt) => { 
      return message.author.id === btnInt.user.id 
    }

    const collector = message.channel.createMessageComponentCollector({
      filter,
      time: 15 * 1000
    })
    
    collector.on('collect', (i) => {
      console.log(`Collected ${i.content}`);
    })

    collector.on('end', collected => {
      console.log(`Collected ${collected.size} items`);
    });


    //message.channel.send({ embeds: [exampleEmbed] });
    


  }
}
