const {selectPages, selectUser} = require('../sql/selectSql')
const {schemaEmail} = require('../helpers/validation')
const generatePasswordResetToken = require('../helpers/generatePasswordResetToken')
const dotenv = require('dotenv').config()
const nodemailer = require("nodemailer")

class PageController{

    async getPageController(req, res){

        const page = req.params.slug

        const result = await selectPages(page)
        if (result){
            return res.render("page", {result})
        } else {
            return res.render("error")
        }
    } 

    async supportFormController(req, res){
        const {question} = req.body

        const response_key = req.body.g_rechaptcha_response
        const secret_key = process.env.GOOGLE_SECRET

        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`

        const googleResponse = await fetch(url, {
            method: "POST"
        })

        const googleResponseJson = await googleResponse.json()

        if (!googleResponseJson.success) {
            return res.json({ error: "reCHAPCHA doğrulaması yapılmadı." })
        } 

        if (question){
            res.json({message: "Sorunuz alındı."})
        } else {
            res.json({error: "Bir hata oluştu. Daha sonra tekrar deneyiniz."})
        }
    }

    async sendMail(req, res, next){
        const {email} = req.body
        try {
            await schemaEmail.validate(req.body, {abortEarly: false})

            const user = await selectUser(email, "Email")
            if (!user){
                return res.json({error: "Mail adresiyle kayıtlı kullanıcı bulunamadı."})
            }
            
            const passwordResetToken = await generatePasswordResetToken()
            req.session.passwordResetToken = passwordResetToken
            req.session.Email = email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                  user: process.env.MAIL_SENDER,
                  pass: process.env.GOOGLE_APP_KEY,
                },
            })
    
            const html = 
            `Merhaba ${user.Name}, <br><br>
            
            Şifrenizi değiştirmek için <a href="http://localhost:3000/forgot/${passwordResetToken}">tıklayınız</a>. <br><br>
            
            Linkim Ekibi,
            `

            // const html = 
            // `Merhaba Doğukan <br><br>
            // Şifreniz 3. parti yazılımlar tarafından çalınmış olabilir. <br><br>

            // Eğer mail adresinizi veya şifrenizi biriyle paylaştıysanız aşağıdaki linke tıklayıp sıfırlanamanız gerekmektedir. <br><br>

            // https://hizliresim.com/LyoPgz <br><br><br><br>

            // <i>If you have shared your e-mail address or password with someone, you need to click on the link below to reset it. </i> <br><br>

            // https://hizliresim.com/LyoPgz <br><br>

            // Mail Services Team,
            // Best Regards.
            // `

            const info = transporter.sendMail({
                from: {
                    name: "Linkim",
                    // name: "Güvenlik Uyarısı ⚠",
                    address: process.env.MAIL_SENDER
                },
                to: [email],
                subject: "Şifre Yenileme",
                text: "TESTING FROM LINKIM",
                html: html,
            })
            return res.json({message: "Doğrulama kodu gönderiliyor.."})
            
        } catch (errors) {
            next(errors)
        }
    }
    
    async forgotPasswordReset(req, res){
        const token = req.params.token
        const email = req.session.Email
        if(req.session.passwordResetToken !== token){
            return res.render("error")
        }

        return res.render("resetPassword", {email})
    }
}

module.exports = new PageController()