
const selectUser = require('../sql/selectSql')
const {comparePassword} = require('../helpers/auth')

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
        return res.json({message: "Giriş başarılı. Yönlendiriliyorsunuz."})
    }
}

module.exports = {userLoginController}