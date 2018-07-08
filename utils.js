const twilio = require('twilio')
const fs = require('fs')

const getWolzeyHome = (file = '') => {
  const userHome = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
  return userHome + '/.wolzeyx/' + file
}

module.exports = {
  getWolzeyHome,
  readUserConfig: () => {
    const filepath = getWolzeyHome('config.json')

    if (!fs.existsSync(filepath)) {
      return null
    }

    return fs.readFileSync(filepath).toString()
  },
  sendSMS: (accountSid, authToken, {body, to, from}) => {
    const client = new twilio(accountSid, authToken)
    return client.messages.create({
      body,
      to,
      from
    })
  }
}
