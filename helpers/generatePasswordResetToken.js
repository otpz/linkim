const crypto = require('crypto')
const {insertResetPassToken} = require('../sql/insertSql')

const generatePasswordResetToken = async () => {
    const randomString = Math.random().toString()
    const passwordResetToken = crypto.createHash('md5').update(randomString).digest("hex")

    const result = await insertResetPassToken(passwordResetToken)
    
    if (result.error){
        return {error: "Token oluşturulurken bir hata meydana geldi."}
    }
    return passwordResetToken
}

module.exports = generatePasswordResetToken