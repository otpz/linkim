const {insertUser} = require('../sql/insertSql')
const {selectUser} = require('../sql/selectSql')
const {comparePassword, hashPassword} = require('../helpers/auth')
const formatDate = require("../helpers/formatDate")
const {schemaRegister, schemaLogin} = require("../helpers/validation")
const fetch = require("isomorphic-fetch")
const dotenv = require('dotenv').config()

class AuthController {

    async registerController(req, res, next){
        const {name, surname, username, email, password} = req.body
        
        const response_key = req.body.g_rechaptcha_response

        const secret_key = process.env.GOOGLE_SECRET

        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`
        try {
            console.log(response_key)
            const googleResponse = await fetch(url, {
                method: "POST"
            })

            const googleResponseJson = await googleResponse.json()
            console.log("rechapta ->", googleResponseJson.success)

            if (!googleResponseJson.success) {
                return res.json({ error: "reCHAPCHA doğrulaması yapılmadı." })
            } 

            await schemaRegister.validate(req.body, {abortEarly: false})

            const userByEmail = await selectUser(email, "Email")
            const userByUserName = await selectUser(username, "UserName")

            if (userByEmail){
                if (userByEmail.UserName === username){
                    return res.json({errorSql: "Bu kullanıcı adı zaten kullanımda."})
                } else if (userByEmail.Email === email){
                    return res.json({errorSql: "Bu email zaten kullanımda."})
                }
            }

            if (userByUserName){
                if (userByUserName.UserName === username){
                    return res.json({errorSql: "Bu kullanıcı adı zaten kullanımda."})
                } else if (userByUserName.Email === email){
                    return res.json({errorSql: "Bu email zaten kullanımda."})
                }
            }
    
            const hashedPassword = await hashPassword(password)
    
            const result = await insertUser(name, surname, username, email, hashedPassword)
    
            if (result.name === "RequestError"){
                return res.json({error: "RequestError"})
            }
    
            return res.json({message: "Kayıt başarıyla oluşturuldu"})
    
        } catch (errors) {
            next(errors) // error middleware
        }
    }

    async loginController(req, res, next){
        const {email, password} = req.body

        try {
            await schemaLogin.validate(req.body, {abortEarly: false})
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
        } catch (errors) {
            next(errors)
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

}

module.exports = new AuthController()