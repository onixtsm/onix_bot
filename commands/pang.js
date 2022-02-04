module.exports = {
        commands: ['pang', 'pa'],
        description: "Pang command",
        hidden: true,
        callback: (message) => {
                message.reply('pong')

        }
}
