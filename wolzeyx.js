#!/usr/bin/env node

const devChat = require('commander')

devChat
  .version('0.1.0')
  .command('connect <url>', 'Connect to server', {isDefault: true})
  .command('default', 'Write defaults')
  .parse(process.argv)
