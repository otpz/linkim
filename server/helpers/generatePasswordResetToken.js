const crypto = require('crypto')

const generatePasswordResetToken = async () => {
    const randomString = Math.random().toString()
    const passwordResetToken = crypto.createHash('md5').update(randomString).digest("hex")

    return passwordResetToken
}

module.exports = generatePasswordResetToken