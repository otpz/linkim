const {selectUser, selectUserLinks} = require('../sql/selectSql')
const formatDate = require("../helpers/formatDate")
const {editUser, editPassword} = require('../sql/setSql')
const {schemaSettings, schemaResetPassword} = require("../helpers/validation")
const {comparePassword, hashPassword} = require("../helpers/auth")

class UserController {

    async profileController(req, res){

        const urlUserName = req.params.username.slice(1)

        const user = await selectUser(urlUserName, "UserName")

        if (user === undefined){
            res.render('error')
            return
        }
    
        const userLinks = await selectUserLinks(user.Id, "UserId")
    
        user.Links = userLinks ? userLinks : []

        user.JoinDate = formatDate(user.JoinDate)
    
        res.render('profile', {user})
    } 

    async settingsController(req, res){
        const currentEmail = req.session.user.Email
        const currentUserName = req.session.user.UserName
    
        const userBody = req.body
    
        try {
            await schemaSettings.validate(req.body, {abortEarly: false})
            const existEmail = await selectUser(userBody.email, 'Email')
            const existUserName = await selectUser(userBody.username, 'UserName')
            if (existEmail && existEmail.Email && existEmail.Email !== currentEmail){
                return res.json({emailError: "Bu email adresi zaten kullanılıyor."})
            } else if (existUserName && existUserName.UserName && existUserName.UserName !== currentUserName){
                return res.json({userNameError: "Bu kullanıcı adı zaten kullanılıyor."})
            } else {
                const result = await editUser(userBody, currentEmail)
                if (result.error){
                    return res.json({errorSql: "Bir hata oluştu. Lütfen tekrar deneyin."})
                }else {
                    const user = await selectUser(userBody.email, "Email")
                    req.session.user = {
                        Id: user.Id,
                        Email: user.Email,
                        Name: user.Name,
                        Surname: user.Surname,
                        UserName: user.UserName,
                        Biography: user.Biography,
                        JoinDate: formatDate(user.JoinDate),
                    }
                    return res.json({message: "Profiliniz başarıyla güncellendi.", username: user.UserName})
                }
            }
        } catch (errors) {
            const errorMessages = errors.inner.map(error => error.message)
            return res.json({error: errorMessages}) 
        }
    }

    async resetPasswordController(req, res){

        const {currentPassword, password, confirmPassword} = req.body
        const userEmail = req.session.user.Email

        try {
            const user = await selectUser(userEmail, "Email")

            await schemaResetPassword.validate(req.body, {abortEarly: false})
            
            const comparedPassword = await comparePassword(currentPassword, user.Password)

            if (!comparedPassword){
                return res.json({passwordError: "Mevcut şifreniz yanlış."})
            } else if (password !== confirmPassword){
                return res.json({passwordMatchError: "Yeni şifreniz tekrarı ile uyuşmalıdır."})
            } else {
                const hashedPassword = await hashPassword(password)
                const result = await editPassword(userEmail, hashedPassword)
                if (result.error){
                    return res.json({errorSql: "Bir hata oluştu. Lütfen tekrar deneyin."})
                }
                return res.json({message: "Şifre başarıyla değiştirildi."})
            }
        } catch (errors) {
            const errorMessages = errors.inner.map(error => error.message)
            return res.json({error: errorMessages})
        }
    }

    async getSettingsController(req, res){
    
        const auth = req.session.auth
    
        if (auth){
            const user = req.session.user
            res.render('settings', user)
        } else{
            res.render('error')
        }
    }
    
}

module.exports = new UserController()
