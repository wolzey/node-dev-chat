const devChat = require('commander')

devChat
  .version('0.1.0')
  .command('connect <url>', 'Connect to server', {isDefault: true})
  .parse(process.argv)
