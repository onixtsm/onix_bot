const {Client, Intents } = require('discord.js')
const fs = require('fs')
const path = require('path')

const config = require('./config.json')
const {prefix} = require('./settings.json')

const listenerInstance = require('./modules/messageListener_module.js')
const buttonListenerInstance = require('./modules/buttonListener_module.js')

const {updateWatcher} = require('./modules/websiteUpdate_module.js')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`)


  client.user.setActivity(`${prefix}help`, {type: 'LISTENING'})



  const guilds = client.guilds.cache

  // Import commands
  const baseFile = 'Icommand.js'
  const defaultOption = require(`./commands/${baseFile}`)


  listenerInstance.messageListener(client)
  buttonListenerInstance.ButtonListener(client)


  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
      if (file.name === baseFile) {
        continue
      }
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file))
      } else if (file !== baseFile) {
        let option = {...defaultOption, ...require(path.join(__dirname, dir, file))}
        defaultOption.validate(option)
        delete option.validate

        listenerInstance.addCommand(option)


      }
    }

  }




  readCommands('commands')
  //helpListener(client)
  updateWatcher(guilds)

})




client.login(config.token)

