const devChat = require('commander')

devChat
  .version('0.1.0')
  .command('connect <url>')
  .action(function (url, cmd) {
    require('./socket/connect')(url)
  })

devChat.parse(process.argv)
