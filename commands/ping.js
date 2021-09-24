module.exports = {
        commands: ['ping', 'p'],
        description: "Ping command",
        callable: false,
        hidden: true,
        callback: (message) => {
                message.reply('pong')

        }
}
