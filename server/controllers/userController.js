const {insertLink, insertUser} = require('../sql/insertSql')
const deleteUserLink = require('../sql/deleteSql')
const {selectUser, selectUserLinks, selectPages} = require('../sql/selectSql')
const {comparePassword, hashPassword} = require('../helpers/auth')
const formatDate = require("../helpers/formatDate")
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const editUser = require('../sql/setSql')


class UserController {

    // formatDate(date){
    //     const newDate = new Date(date)
    //     const options = { month: 'long', day: 'numeric'}
    //     return new Intl.DateTimeFormat('tr-TR', options).format(newDate);
    // }

    async addLinkController(req, res){

        const {title, link} = req.body
        
        const urlExpression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

        const urlRegex = new RegExp(urlExpression)

        const id = req.session.user ? req.session.user.Id : null
    
        if (id){
            if (!title || !link){
                return res.json({error: 'Lütfen bir başlık ve URL adresi girin.'})
            } else if (!link.match(urlRegex)){
                return res.json({urlError: 'Lütfen doğru bir URL adresi giriniz.'})
            }   
            
            const result = await insertLink(id, title, link)
        
            if (result.message){
                return res.json({message: "URL Adresi başarıyla eklendi."})
            } else {
                return res.json({error: "Bir hata oluştu."})
            }
        } else {
            return res.json({error: "Lütfen giriş yapın."})
        }
    }

    async deleteLinkController(req, res){
        const id = req.params.id

        const userId = req.session.user.Id // giriş yapan kullanıcı id'si

        const userLinks = await selectUserLinks(userId, "UserId")

        let match = false

        userLinks.forEach(links => {
            if (links.Id == id){
                match = true
            }
        })

        if (!match){
            return res.json({error: "Link Bulunamadı."})
        }

        const result = await deleteUserLink(id)

        if (result.message){
            return res.json({message: "Link Silindi."})
        } else {
            return res.json({error: "Link Silinemedi."})
        }
    }

    async loginController(req, res){
        const {email, password} = req.body
    
        const user = await selectUser(email, "Email")
    
        if (user === undefined){
            return res.json({undefined: "Kullanıcı bulunamadı."})
        }
    
        const comparedPassword = await comparePassword(password, user.Password)
    
        if (!comparedPassword){
            return res.json({passwordError: "Şifre eşleşmiyor."})
        } else {
    

            // Session
            req.session.user = {
                Id: user.Id,
                Email: user.Email,
                Name: user.Name,
                Surname: user.Surname,
                UserName: user.UserName,
                Biography: user.Biography,
                JoinDate: formatDate(user.JoinDate),
            }
            req.session.auth = true
    
            return res.json({message: "Giriş başarılı.", userName: user.UserName})
        }
    }

    logoutController(req, res){
        req.session.destroy((err) => {
          if (err) {
              console.log(err)
          }
          const interval = setInterval(() => {
            res.redirect('/')
            clearInterval(interval)
          }, 500)
        })
    }

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

    async registerController(req, res){
        const {name, surname, username, email, password} = req.body
        
        try {
            
            const user = await selectUser(email, "Email")
    
            if (user){
                if (user.UserName === username){
                    return res.json({error: "Bu kullanıcı adı zaten kullanımda."})
                } else if (user.Email === email){
                    return res.json({error: "Bu email zaten kullanımda."})
                }
            }
    
            const hashedPassword = await hashPassword(password)
    
            const result = await insertUser(name, surname, username, email, hashedPassword)
    
            if (result.name === "RequestError"){
                return res.json({error: "RequestError"})
            }
    
            return res.json({message: "Kayıt başarıyla oluşturuldu"})
    
        } catch (error) {
            console.log(error)
            return res.json({error: error})        
        }
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

    async getAboutPageController(req, res){
        const result = await selectPages("hakkimizda")
        if (result){
            return res.render("about", {result})
        } else {
            return res.render(error)
        }
    } 
}

module.exports = new UserController()
