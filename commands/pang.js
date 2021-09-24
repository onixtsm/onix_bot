module.exports = {
        commands: ['pang'],
        description: "Pang command",
        callable: false,
        hidden: true,
        callback: (message) => {
                message.reply('pong')

        }
}
