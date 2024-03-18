const crypto = require('crypto')

const generateTokenMd5 = (req, res, next) => {
    const randomString = Math.random().toString()
    const csrfToken = crypto.createHash('md5').update(randomString).digest("hex")

    // session ve input'daki token'lar aynı olacak
    req.session.csrfToken = csrfToken 
    res.locals.csrfToken = csrfToken 

    next()
}


module.exports = generateTokenMd5