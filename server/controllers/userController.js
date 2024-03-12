const {selectUser, selectUserLinks} = require('../sql/selectSql')
const formatDate = require("../helpers/formatDate")
const editUser = require('../sql/setSql')

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
    
        const existEmail = await selectUser(userBody.email, 'Email')
        const existUserName = await selectUser(userBody.username, 'UserName')
    
        if (existEmail && existEmail.Email && existEmail.Email !== currentEmail){
            return res.json({emailError: "Bu email adresi zaten kullanılıyor."})
        } else if (existUserName && existUserName.UserName && existUserName.UserName !== currentUserName){
            return res.json({userNameError: "Bu kullanıcı adı zaten kullanılıyor."})
        } else {
            const result = await editUser(userBody, currentEmail)
            if (result.error){
                return res.json({error: "Bir hata oluştu. Lütfen tekrar deneyin."})
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
