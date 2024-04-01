const crypto = require('crypto')
const {hashPassword} = require('../helpers/auth') 

const generateTokenMd5 = async (req, res, next) => {
    const randomString = Math.random().toString()
    const csrfToken = crypto.createHash('md5').update(randomString).digest("hex")

    // session ve input'daki token'lar aynı olacak
    req.session.csrfToken = csrfToken
    res.locals.csrfToken = await hashPassword(csrfToken) 

    next()
}


module.exports = generateTokenMd5