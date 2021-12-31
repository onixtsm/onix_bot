const { Interaction, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

let game = {}
let fieldMessage
let player_id
let mineCount
let flagCount
let lost = false

let IField = () => {
  return {
    NUMBER: 0,
    HIDDEN: true,
    MINE: false,
    FLAGGED: false
  }
}

let fill = (f) => {
 for (let i = 0; i < f.length; i++) {
    for (let j = 0; j < f.length; j++) {
      f[i][j] = IField()
    }
  }

  return f
}

const generate = (level) => {
 
  mineCount = level[1]
  let side = level[0]
  let field = Array.from(Array(side), () => new Array(side))
 
  field = fill(field)

  for (let i = 0; i < mineCount;) {
    let x = Math.floor(Math.random() * side)
    let y = Math.floor(Math.random() * side)

    if (!field[x][y].MINE) {
      field[x][y].MINE = true 
      i++
    }

    
  }

  for (let i = 0; i < side; i++) {
    for (let j = 0; j < side; j++ ) {
      if (field[i][j].MINE) continue

      let xi
      let yj

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {

          if (x !== 0 || y !== 0) {
            xi = i + x
            yj = j + y
            if ((0 <= xi && xi < side) && (0 <= yj && yj < side)) {
              if (field[xi][yj].MINE) {
                field[i][j].NUMBER++
              }
            }
          }
        }
      }

    }
  }
 

  return field
}

const Play = async (level, message) => {
  lost = false
  player_id = message.author.id
 flagCount = 0
  game = { 
    field: generate(level),
    cursor: {
      x: 0,//Math.floor(level[0]/2),
      y: 0//Math.floor(level[0]/2)
    }

  }

  const template = {
    content: 'loading field...'
  }

  fieldMessage = await message.channel.send(template)

  await nextStep()

  
}

const nextStep = async () => {

  await printField()
  if (lost) {
    return
  }
}

const ButtonHandler = (interaction) => {
  interaction.deferUpdate()

  if(interaction.user.id !== player_id) return

  direction = interaction.customId.split('-', 2)[1]
  

  const size = game.field.length - 1
  switch (direction) {
    case 'up':
      if (game.cursor.y === 0) {
        game.cursor.y = size
      } else {
        game.cursor.y -= 1
      }
      break

    case 'down':
      if (game.cursor.y === size) {
        game.cursor.y = 0
      } else {
        game.cursor.y += 1
      }
      break
      
    case 'left':
      if (game.cursor.x === 0) {
        game.cursor.x = size
      } else {
        game.cursor.x -= 1
      }
      break

    case 'right':
      if (game.cursor.x === size) {
        game.cursor.x = 0
      } else {
        game.cursor.x += 1
      }
      break

    case 'flag': 
      let x = game.cursor.x
      let y = game.cursor.y
      if (game.field[y][x].FLAGGED) {
        game.field[y][x].FLAGGED = false
        flagCount -= 1
      } else {
        if (flagCount < mineCount) {
          game.field[y][x].FLAGGED = true
          flagCount++
        }
      }
      break

    case 'show':
      if (game.field[game.cursor.y][game.cursor.x].FLAGGED) {
        game.field[game.cursor.y][game.cursor.x].FLAGGED = false
        flagCount--
      }

      show(game.cursor.x, game.cursor.y)
      break

  }
  nextStep()
  
}

const show = (x, y) => {

  game.field[y][x].HIDDEN = false

  if(game.field[y][x].MINE) {
    lost = true
    return
  }

  side = game.field.length


  if (game.field[y][x].NUMBER === 0) {

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i !== 0 || j !== 0) {
          let xi = i + x
          let yj = j + y
          if ((0 <= xi && xi < side) && (0 <= yj && yj < side)) {

            if (!game.field[yj][xi].FLAGGED) { 

              if (game.field[yj][xi].NUMBER === 0 && game.field[yj][xi].HIDDEN) {
                show(xi, yj)
              }

              game.field[yj][xi].HIDDEN = false
            }

          }
        }
      }
    }
  }


}

const printField = async () => {
  const field = game.field

  let output = '```\n'

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field.length; j++ ) {
      if (lost && field[i][j].MINE) {
        output += '*'
      } else if (j == game.cursor.x && i == game.cursor.y) {
        output += '+'
      } else if (field[i][j].FLAGGED) {
        output += '?'
      } else if (field[i][j].HIDDEN) {
        output += '.'
      } else {
        output += field[i][j].NUMBER
      }
    }
    output += '\n'
  }
  output += '```'

  const fieldEmbed = new MessageEmbed()
  const controls = new MessageActionRow()
  const actions = new MessageActionRow()
  let template = {}
  if (!lost) {

      fieldEmbed.setTitle('MINESWEEPER')
      .addField(`Flags used ${flagCount}/${mineCount}`, output, false)

      controls.addComponents(
        new MessageButton()
          .setCustomId('minesweeper-left')
          .setEmoji('⬅️')
          .setStyle('SECONDARY')
      )
      .addComponents(
        new MessageButton()
          .setCustomId('minesweeper-right')
          .setEmoji('➡️')
          .setStyle('SECONDARY')
      )
      .addComponents(
        new MessageButton()
          .setCustomId('minesweeper-up')
          .setEmoji('⬆️')
          .setStyle('SECONDARY')
      )
      .addComponents(
        new MessageButton()
          .setCustomId('minesweeper-down')
          .setEmoji('⬇️')
          .setStyle('SECONDARY')
      )
      actions.addComponents(
        new MessageButton()
          .setCustomId('minesweeper-show')
          .setEmoji('👀')
          .setStyle('DANGER')
      )
      .addComponents(
        new MessageButton()
          .setCustomId('minesweeper-flag')
          .setEmoji('🚩')
          .setStyle('SUCCESS')
      )
    template.components = [controls, actions]
  } else {
    fieldEmbed.setTitle('LOST')
    .addField(`Flags used ${flagCount}/${mineCount}`, output, false)
  }


  template.content = '\u200b'
  template.embeds = [fieldEmbed]

  await fieldMessage.edit(template)

}


module.exports = {
  Play,
  ButtonHandler
}
