const program = require('commander')
const twilio  = require('twilio')

const { readUserConfig, sendSMS } = require('./utils')

program
  .option('-t, --to <user number>')
  .option('-m, --message <message body>')
  .parse(process.argv)

const userConfig = readUserConfig()

if (!userConfig) {
  return process.exit(1)
}

let jsonConfig = JSON.parse(userConfig)

let {
  twilioId,
  twilioToken,
  twilioNumber
} = jsonConfig

if (!twilioId || !twilioToken || !twilioNumber) {
  return process.exit(1)
}
if (!program.to || !program.message) {
  console.error('You are missing necessary options')
  return process.exit(1)
}

sendSMS(twilioId, twilioToken, {
  to: program.to,
  from: twilioNumber,
  body: program.message
})
.then((message) => {
  console.log('Message sent.')
})
.catch((error) => {
  console.error('Could not send your message.')
})
