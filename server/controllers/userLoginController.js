
const selectUser = require('../sql/selectSql')
const {comparePassword} = require('../helpers/auth')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

// login endpoint
const userLoginController = async (req, res) => {
    const {email, password} = req.body

    const user = await selectUser(email)

    if (user === undefined){
        return res.json({undefined: "Kullanıcı bulunamadı."})
    }

    const comparedPassword = await comparePassword(password, user.Password)

    if (!comparedPassword){
        return res.json({passwordError: "Şifre eşleşmiyor."})
    } else {

        // Session
        req.session.user = {
            email: user.Email,
            name: user.Name,
            surname: user.Surname,
            username: user.UserName
        }
        req.session.auth = true

        return res.json({message: "Giriş başarılı."})
    }
}
module.exports = userLoginController