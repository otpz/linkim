
const selectUser = require('../sql/selectSql')

// login endpoint
const userLoginController = async (req, res) => {
    const {email, password} = req.body

    const user = await selectUser(email)

    if (user === undefined){
        return res.json({undefined: "Kullanıcı bulunamadı."})
    }

    if (user.Password !== password){
        return res.json({passwordError: "Şifre eşleşmiyor."})
    } else {
        return res.json({message: "Giriş başarılı. Yönlendiriliyorsunuz."})
    }

    // res.json({email: email, password: password})
}

module.exports = {userLoginController}