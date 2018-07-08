const program = require('commander')
const fs = require('fs')
const configTemplate = require('./modules/config.template.json')
const { getWolzeyHome } = require('./utils')

program
  .option('-u, --url <connection-url>')
  .option('-n, --nickname <user-nickname>')
  .option('-r, --room <room-name>')
  .option('-i, --twilio-id <twilio-account-sid>')
  .option('-f, --twilio-number <twilio-from>')
  .option('-t, --twilio-token <twilio-token>')
  .parse(process.argv)

if (!fs.existsSync(getWolzeyHome())) {
  fs.mkdirSync(getWolzeyHome())
}

if (!fs.existsSync(getWolzeyHome('config.json'))) {
  fs.writeFileSync(getWolzeyHome('config.json'), JSON.stringify(configTemplate, null, 2))
}

let userConfig = JSON.parse(fs.readFileSync(getWolzeyHome('config.json')).toString())
console.log(program)
let editedConfig = [
  'nickname', 'url', 'room',
  'twilioId', 'twilioNumber', 'twilioToken'
].reduce((newConfig, confVar) => {
  if (program[confVar]) {
    newConfig[confVar] = program[confVar]
  } else {
    newConfig[confVar] = userConfig[confVar]
  }
  return newConfig
}, {})

fs.writeFileSync(getWolzeyHome('config.json'), JSON.stringify(editedConfig))
console.log(JSON.stringify(editedConfig, null, 2))
