
const selectUser = require('../sql/selectSql')
const {comparePassword} = require('../helpers/auth')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

// login endpoint
const userLoginController = async (req, res) => {
    const {email, password} = req.body

    const user = await selectUser(email, "Email")

    if (user === undefined){
        return res.json({undefined: "Kullanıcı bulunamadı."})
    }

    const comparedPassword = await comparePassword(password, user.Password)

    if (!comparedPassword){
        return res.json({passwordError: "Şifre eşleşmiyor."})
    } else {

        const date = new Date(user.JoinDate)
        const formattedDate = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(date);

        // Session
        req.session.user = {
            email: user.Email,
            name: user.Name,
            surname: user.Surname,
            userName: user.UserName,
            bio: user.Biography,
            joinDate: formattedDate,
        }
        req.session.auth = true

        return res.json({message: "Giriş başarılı.", userName: user.UserName})
    }
}
module.exports = userLoginController