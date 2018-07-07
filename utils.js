module.exports = {
  getWolzeyHome: (file = '') => {
    const userHome = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
    return userHome + '/.wolzeyx/' + file
  }
}
