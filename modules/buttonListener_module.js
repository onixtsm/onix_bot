const fs = require('fs')
const path = require('path')

let ButtonListener = (client) => {
  readButtons('../modules/')
  client.on('interactionCreate', (interaction) => onClick(interaction))
}

let onClick = (interaction) => {
  if (!interaction.isButton) return
  module = interaction.customId.split('-', 1)
  buttonTable[module](interaction)
  
}

const buttonTable = {}

const readButtons = (dir) => {

  const baseFile = 'ButtonListener_module.js'

  const files = fs.readdirSync(path.join(__dirname, dir))
  for (const file of files) {
    if (file.name === baseFile) {
      continue
    }
    const stat = fs.lstatSync(path.join(__dirname, dir, file))
    if (stat.isDirectory()) {
      readButtons(path.join(dir, file))
    } else if (file !== baseFile) {

      let { ButtonHandler } = require(path.join(__dirname, dir, file))
      if (typeof ButtonHandler === 'undefined') continue

      buttonTable[file.split('_', 1)] = ButtonHandler
    }
  }
}

module.exports = {
  ButtonListener
}
