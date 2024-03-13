const {insertUser} = require('../sql/insertSql')
const {selectUser} = require('../sql/selectSql')
const {comparePassword, hashPassword} = require('../helpers/auth')
const formatDate = require("../helpers/formatDate")
const {schema} = require("../helpers/validation")

class AuthController {

    async registerController(req, res){
        const {name, surname, username, email, password} = req.body
        
        try {
            await schema.validate(req.body, {abortEarly: false})

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
            const errorMessages = errors.inner.map(error => error.message)
            return res.json({error: errorMessages})        
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

}

module.exports = new AuthController()