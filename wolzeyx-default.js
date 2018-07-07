const program = require('commander')
const fs = require('fs')
const configTemplate = require('./modules/config.template.json')
const { getWolzeyHome } = require('./utils')

program
  .option('-u, --url <connection-url>')
  .option('-n, --nickname <user-nickname>')
  .option('-r, --room <room-name>')
  .parse(process.argv)

if (!fs.existsSync(getWolzeyHome())) {
  fs.mkdirSync(getWolzeyHome())
}

if (!fs.existsSync(getWolzeyHome('config.json'))) {
  fs.writeFileSync(getWolzeyHome('config.json'), configTemplate)
}

let userConfig = JSON.parse(fs.readFileSync(getWolzeyHome('config.json')).toString())

let editedConfig = ['nickname', 'url', 'room'].reduce((newConfig, confVar) => {
  if (program[confVar]) {
    newConfig[confVar] = program[confVar]
  } else {
    newConfig[confVar] = userConfig[confVar]
  }
  return newConfig
}, {})

fs.writeFileSync(getWolzeyHome('config.json'), JSON.stringify(editedConfig))
console.log(JSON.stringify(editedConfig, null, 2))
