const bcrypt = require('bcrypt')

//hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(12)
    // const salt = "$2b$12$X5wjd1wd812dj"
    return await bcrypt.hash(password, salt)
}

//compare password
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}

module.exports = { hashPassword, comparePassword }