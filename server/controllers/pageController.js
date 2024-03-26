const {selectPages, selectUser, selectResetPassToken, selectUserAnsweredQuestions, selectQuestionLikes} = require('../sql/selectSql')
const {deleteResetPassToken} = require('../sql/deleteSql')
const {editPassword} = require('../sql/setSql')
const {schemaEmail, schemaResetPassword, schemaSupport} = require('../helpers/validation')
const generatePasswordResetToken = require('../helpers/generatePasswordResetToken')
const dotenv = require('dotenv').config()
const nodemailer = require("nodemailer")
const {hashPassword} = require("../helpers/auth")
const calculateTimeElapsed = require("../helpers/calculateTimeElapsed")

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
        const {name, email, question} = req.body

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

        try {
            await schemaSupport.validate(req.body, {abortEarly: false})

            if (!question){
                return res.json({error: "Soru kısmını boş bırakmayınız."})
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.MAIL_SENDER,
                    pass: process.env.GOOGLE_APP_KEY
                },
            })

            const html = 
            `Gönderen bilgileri: ${name}, ${email} <br><br>
            
            Gönderenin mesajı;<br>

            ${question} <br>

            Linkim Destek Bölümü Mesajları<br>
            `
            const info = transporter.sendMail({
                from: {
                    name: name,
                    address: process.env.MAIL_SENDER
                },
                to: [process.env.MAIL_SENDER],
                subject: "Destek",
                text: "TESTING FROM LINKIM",
                html: html,
            })

            return res.json({message: "Sorunuz alındı."})

        } catch (errors) {
            next(errors)
        }
    }

    async sendMailController(req, res, next){
        const {email} = req.body
        try {
            await schemaEmail.validate(req.body, {abortEarly: false})

            const user = await selectUser(email, "Email")
            if (!user){
                return res.json({error: "Mail adresiyle kayıtlı kullanıcı bulunamadı."})
            }
            
            const passwordResetToken = await generatePasswordResetToken()

            if (passwordResetToken.error){
                return res.json(passwordResetToken.error)
            }

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

            Linkim Ekibi, <br>
            İyi günler.
            `

            const info = transporter.sendMail({
                from: {
                    name: "Linkim",
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
    
    async getforgotPasswordController(req, res){
        const token = req.params.token
        const email = req.session.Email
        const result = await selectResetPassToken(token)

        if (!result){
            return res.render("error")
        }

        const expireEnd = result.ExpireEnd.setHours(result.ExpireEnd.getHours()-3)
        const now = new Date()
        const diff = expireEnd - now

        const deleteResult = await deleteResetPassToken(token)
        if (deleteResult.error){
            return res.json({message: "silinemedi"})
        }
    
        if (diff <= 0){
            return res.render("error")
        }

        if(req.session.passwordResetToken === undefined || (req.session.passwordResetToken !== token)){
            return res.render("error")
        }

        return res.render("resetPassword", {email})
    }

    async resetForgotPasswordController(req, res, next){

        const {email, password, confirmPassword} = req.body

        try {
            const user = await selectUser(email, "Email")
            if (!user){
                delete res.session.passwordResetToken
                return res.json({error: "Kullanıcı bulunamadı."})
            }
            await schemaResetPassword.validate(req.body, {abortEarly: false})

            if (password !== confirmPassword){
                return res.json({passwordMatchError: "Yeni şifreniz tekrarı ile uyuşmalıdır."})
            } else {
                const hashedPassword = await hashPassword(password)
                const result = await editPassword(email, hashedPassword)
                if (result.error){
                    return res.json({errorSql: "Bir hata oluştu. Lütfen tekrar deneyin."})
                }
                req.session.passwordResetToken = undefined
                return res.json({message: "Şifre başarıyla yenilendi."})
            }
        } catch (errors) {
            next(errors) // error middleware
        }
    }

    async getDiscoverPageController(req, res){

        const questions = await selectUserAnsweredQuestions()

        const auth = req.session.auth
        const authUserId = req.session.user.Id

        if (!auth){
            res.render("error")
        }

        const didILiked = (questionLikes) => {
            let yes = 0
            questionLikes.forEach(el => {
                if (el.UserId === authUserId){
                    yes = 1
                }
            })
            return yes
        }

        for (const question of questions) {
            const questionerUser = await selectUser(question.QuestionerId, "Id");
            const questionLikes = await selectQuestionLikes(question.Id)
            const user = await selectUser(question.UserId, "Id")

            question.Questioner = {
                QuestionerName: questionerUser.Name,
                QuestionerSurname: questionerUser.Surname,
                QuestionerUserName: questionerUser.UserName
            }

            question.User = {
                Name: user.Name,
                Surname: user.Surname,
                UserName: user.UserName,
            }

            question.LikeInfo = {
                Likes: questionLikes.length,
                ILiked: didILiked(questionLikes)
            }

            if (question.AnsweredDate){
                const now = new Date()
                question.TimeElapsed = calculateTimeElapsed(now, question.AnsweredDate)
            }
        }


        res.render("discover", {questions})
    }
}

module.exports = new PageController()