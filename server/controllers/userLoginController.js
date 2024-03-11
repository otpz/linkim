
const {selectUser} = require('../sql/selectSql')
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

        const date = new Date(user.JoinDate);
        const options = { month: 'long', day: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('tr-TR', options).format(date);

        // Session
        req.session.user = {
            Id: user.Id,
            Email: user.Email,
            Name: user.Name,
            Surname: user.Surname,
            UserName: user.UserName,
            Biography: user.Biography,
            JoinDate: formattedDate,
        }
        req.session.auth = true

        return res.json({message: "Giriş başarılı.", userName: user.UserName})
    }
}
module.exports = userLoginController