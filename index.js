const socket = require('socket.io-client')('http://localhost:1337')
const {blue, green, red} = require('chalk')
const readline = require('readline')


socket.on('connect', () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: null,
    prompt: '>'
  })

  const console_out = (msg) => {
    process.stdout.clearLine(1)
    process.stdout.cursorTo(0)
    console.log(msg)
    rl.prompt(true)
  }

  rl.prompt()


  rl.on('line', (line) => {
    if (line == '/clear') {
      process.stdout.write('\033c')
    }

    line    = line.toString().trim()

    if (!line.match(/^\//)) {
      return socket.emit('send', line)
    }

    command = line.split(' ')[0].slice(1)
    args    = line.split(' ').slice(1)

    socket.emit(command, args.join(' '))
    rl.prompt()
  })

  socket.emit('nick', 'Wolzey')
  socket.emit('join', 'general')

  socket.on('nickname', (username) => {
    console_out('Your username is now:', username)
  })

  socket.on('user join', ({user, room}) => {
    console_out(`${blue(user)} ${green('just joined room')} ${red.bold(room)}`)
  })

  socket.on('user message', ({username, message}) => {
    console_out(`<${blue(username)}>: ${message}`)
  })

  socket.on('help', (commands) => {
    console_out(commands)
  })
})
