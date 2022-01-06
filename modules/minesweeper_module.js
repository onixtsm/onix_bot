const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')

let playerTable = {}

let IField = () => {
  return {
    NUMBER: 0,
    HIDDEN: true,
    MINE: false,
    FLAGGED: false,
  }
}

// Main
const Play = async (level, message) => {
  id = message.author.id
  playerTable[id] = {
    field: generate(level),
    cursor: {
      x: Math.floor(level[0] / 2),
      y: Math.floor(level[0] / 2),
    },
    opened: 0,
    lost: false,
    flagCount: 0,
    mineCount: level[1],
  }

  const template = {
    content: 'loading field...',
  }
  playerTable[id]['fieldMessage'] = await message.channel.send(template)
  // game['fieldMessage'] = await message.channel.send(template)
  await nextStep(playerTable[id])
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
  let side = level[0]
  let mineCount = level[1]
  let field = Array.from(Array(side), () => new Array(side))

  field = fill(field)

  for (let i = 0; i < mineCount; ) {
    let x = Math.floor(Math.random() * side)
    let y = Math.floor(Math.random() * side)

    if (!field[x][y].MINE) {
      field[x][y].MINE = true
      i++
    }
  }

  for (let i = 0; i < side; i++) {
    for (let j = 0; j < side; j++) {
      if (field[i][j].MINE) continue

      let xi
      let yj

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          if (x !== 0 || y !== 0) {
            xi = i + x
            yj = j + y
            if (0 <= xi && xi < side && 0 <= yj && yj < side) {
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

const nextStep = async (game) => {
  await printField(game)
  if (game.lost) {
    return
  }
}

const ButtonHandler = (interaction) => {
  interaction.deferUpdate()

  if (!(interaction.user.id in playerTable)) return

  game = playerTable[interaction.user.id]

  direction = interaction.customId.split('-', 2)[1]

  const size = game.field.length - 1
  let moves = 0
  switch (direction) {
    case 'up':
      do {
        if (game.cursor.y === 0) {
          game.cursor.y = size
        } else {
          game.cursor.y -= 1
        }
      } while (
        !game.field[game.cursor.y][game.cursor.x].HIDDEN &&
        moves === side
      )
      break

    case 'down':
      do {
        if (game.cursor.y === size) {
          game.cursor.y = 0
        } else {
          game.cursor.y += 1
        }
      } while (
        !game.field[game.cursor.y][game.cursor.x].HIDDEN &&
        moves === side
      )
      break

    case 'left':
      do {
        if (game.cursor.x === 0) {
          game.cursor.x = size
        } else {
          game.cursor.x -= 1
        }
      } while (
        !game.field[game.cursor.y][game.cursor.x].HIDDEN &&
        moves === side
      )
      break

    case 'right':
      do {
        if (game.cursor.x === size) {
          game.cursor.x = 0
        } else {
          game.cursor.x += 1
        }
      } while (
        !game.field[game.cursor.y][game.cursor.x].HIDDEN &&
        moves === side
      )
      break

    case 'flag':
      let x = game.cursor.x
      let y = game.cursor.y
      if (game.field[y][x].FLAGGED) {
        game.field[y][x].FLAGGED = false
        game.flagCount--
      } else {
        if (game.flagCount < game.mineCount && game.field[y][x].HIDDEN) {
          game.field[y][x].FLAGGED = true
          game.flagCount++
        }
      }
      break

    case 'show':
      if (game.field[game.cursor.y][game.cursor.x].FLAGGED) {
        game.field[game.cursor.y][game.cursor.x].FLAGGED = false
        game.flagCount--
      }
      game.field[game.cursor.y][game.cursor.x].HIDDEN = false
      if (game.field[game.cursor.y][game.cursor.x].MINE) {
        game.lost = true
        break
      }
      game.opened++

      show(game.cursor.x, game.cursor.y)
      break
  }
  nextStep(game)
}

const show = (x, y) => {
  game.field[y][x].HIDDEN = false
  if (game.field[y][x].MINE) {
    game.lost = true
    return
  }
  side = game.field.length

  if (game.field[y][x].NUMBER === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i !== 0 || j !== 0) {
          let xi = i + x
          let yj = j + y
          if (0 <= xi && xi < side && 0 <= yj && yj < side) {
            if (!game.field[yj][xi].FLAGGED) {
              if (game.field[yj][xi].HIDDEN) {
                game.opened++
                if (game.field[yj][xi].NUMBER === 0) {
                  show(xi, yj)
                }
              }
              game.field[yj][xi].HIDDEN = false
            }
          }
        }
      }
    }
  }
}

const printField = async (game) => {
  ;({ field, lost, mineCount, opened, cursor, flagCount } = game)
  let output = '```\n'

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field.length; j++) {
      if (lost && field[i][j].MINE) {
        output += '*'
      } else if (j == cursor.x && i == cursor.y) {
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
  let template = { components: [] }
  let actionField = {}
  if (field.length * field.length - mineCount === opened) {
    fieldEmbed.setTitle('WIN').setColor('00ff00')
    actionField = {
      name: '\u200b',
      value: 'Result\nYou won',
      inline: true,
    }
  } else if (lost) {
    fieldEmbed.setTitle('LOST').setColor('ff0000')

    actionField = {
      name: '\u200b',
      value: 'Result:\nYou lost',
      inline: true,
    }
  } else {
    fieldEmbed.setTitle('MINESWEEPER').setColor('edd0b1')

    let cursorCell = field[cursor.y][cursor.x]
    let value
    if (!cursorCell.HIDDEN) {
      value = cursorCell.NUMBER
    } else if (cursorCell.FLAGGED) {
      value = '?'
    } else {
      value = '.'
    }
    actionField = {
      name: `\u200b`,
      value: `Value under cursor:\n${value}`,
      inline: true,
    }
    controls
      .addComponents(
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
    actions
      .addComponents(
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
  }
  fieldEmbed.addFields(
    {
      name: `Flags used ${flagCount}/${mineCount}`,
      value: output,
      inline: true,
    },
    actionField
  )

  template.content = '\u200b'
  template.embeds = [fieldEmbed]

  await game.fieldMessage
    .edit(template)
    .then((edited) => (game.fieldMessage = edited))
}

module.exports = {
  Play,
  ButtonHandler,
}
