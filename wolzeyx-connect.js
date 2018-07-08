const readline = require('readline')
const chalk    = require('chalk')
const fs = require('fs')
const {
  JOIN_ERROR,
  MESSAGE_ERROR,
  USER_JOIN,
  USER_LEAVE,
  USER_MESSAGE,
  WHISPER,
  NICKNAME
} = require('./socket/events')

const {
  Commands: {
    SEND,
    JOIN,
    HELP,
    NICK
  }
} = require('./socket/constants')

const { parseUserInput } = require('./socket/utils')
const { getWolzeyHome } = require('./utils')

let url = process.argv[2]
let userPreferences

if (fs.existsSync(getWolzeyHome('config.json'))) {
  userPreferences = JSON.parse(fs.readFileSync(getWolzeyHome('config.json')).toString())
}

if (!url) {
  if (!userPreferences) {
    return console.log('Missing connection url')
  }

  if (!userPreferences.url) {
    return console.log('Missing connection url')
  }

  url = userPreferences.url
}

const socket = require('socket.io-client')(url)

const console_msg = (msg) => {
  readline.clearLine()
  readline.moveCursor(process.stdout, 0,-1)
  console.log(msg)
  rl.prompt(true)
}

socket.on('connect', () => {
  if (userPreferences && userPreferences.nickname) {
    socket.emit('nick', userPreferences.nickname)
  }

  if (userPreferences && userPreferences.room) {
    socket.emit('join', userPreferences.room)
  }

  socket.on(JOIN_ERROR, (error) => {
    console_msg(chalk.red(error))
  })

  socket.on(MESSAGE_ERROR, (error) => {
    console_msg(chalk.red(error))
  })

  socket.on(USER_MESSAGE, ({username, message}) => {
    console_msg(`<${chalk.bold.blue(username)}>: ${chalk.green(message)}\n`)
  })
  socket.on(USER_JOIN, ({user, room}) => {
    console_msg(`${chalk.green(user)} joined ${chalk.red(room)}\n`)
  })
  socket.on(NICKNAME, (username) => {
    console_msg(`\n${username} is your new nickname\n`)
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
