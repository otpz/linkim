const {insertUser} = require('../sql/insertSql')
const {selectUser} = require('../sql/selectSql')
const {comparePassword, hashPassword} = require('../helpers/auth')
const formatDate = require("../helpers/formatDate")

class AuthController {

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