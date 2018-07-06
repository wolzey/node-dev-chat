const readline = require('readline')

module.exports = {
  parseUserInput: (line) => {
    let command
    let args

    if (!line.match(/^\//)) {
      return {
        command: 'send',
        args: line
      }
    }

    return {
      command: line.split(' ')[0].slice(1),
      args: line.split(' ').slice(1)
    }
  }
}
