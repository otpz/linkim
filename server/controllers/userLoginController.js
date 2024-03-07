
const selectUser = require('../sql/selectSql')
const {comparePassword} = require('../helpers/auth')
const jwt = require('jsonwebtoken')


// login endpoint
const userLoginController = async (req, res) => {
    const {email, password} = req.body

    const user = await selectUser(email)

    if (user === undefined){
        return res.json({undefined: "Kullanıcı bulunamadı."})
    }

    const comparedPassword = await comparePassword(password, user.Password) // bool
    
    if (!comparedPassword){
        return res.json({passwordError: "Şifre eşleşmiyor."})
    } else {
        jwt.sign({email: user.Email, id: user.Id, name: user.Name}, process.env.JWT_SECRET, {}, (err, token) => {
            if (err) throw err
            res.cookie('token', token).json(user)
        })
        // return res.json({message: "Giriş başarılı. Yönlendiriliyorsunuz."})
    }
}

module.exports = {userLoginController}