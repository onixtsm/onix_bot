module.exports = {
        commands: ['ping', 'p'],
        description: "Ping command",
        callable: true,
        hidden: true,
        callback: (message) => {
                message.reply('pong')

        }
}
