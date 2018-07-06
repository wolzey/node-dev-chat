const readline = require('readline')
const chalk    = require('chalk')
const {
  USER_JOIN,
  USER_MESSAGE,
  WHISPER,
  NICKNAME
} = require('./events')

const {
  Commands: {
    SEND,
    JOIN,
    HELP,
    NICK
  }
} = require('./constants')

const { parseUserInput } = require('./utils')

module.exports = (url) => {
  const socket = require('socket.io-client')(url)

  const console_msg = (msg) => {
    readline.clearLine()
    readline.moveCursor(process.stdout, 0,-1)
    console.log(msg)
    rl.prompt(true)
  }

  socket.on('connect', () => {
    socket.on(USER_MESSAGE, ({username, message}) => {
      console_msg(`<${chalk.bold.blue(username)}>: ${chalk.green(message)}`)
    })
    socket.on(USER_JOIN, ({user, room}) => {
      console_msg(`${chalk.green(user)} joined ${chalk.red(room)}`)
    })
    socket.on(NICKNAME, (username) => {
      console_msg(`${username} is your new nickname`)
    })
    socket.on(HELP, (commands) => {
      console_msg(commands)
    })
  })

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.prompt(true)

  rl.on('line', (line) => {
    if (line === '') {
      return console_msg('\r')
    }
    let { command, args } = parseUserInput(line)

    switch(command) {
      case SEND:
        socket.emit(SEND, args)
        break
      case JOIN:
        socket.emit(JOIN, args[0])
        break
      case NICK:
        socket.emit(NICK, args[0])
        break
      case HELP:
        socket.emit(HELP)
      default:
        return
    }
  })
}
