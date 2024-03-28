const {selectUser, selectUserLinks, selectUserStyles, selectExistStyles, selectUserQuestions, selectQuestionLikes} = require('../sql/selectSql')
const {insertStyle} = require('../sql/insertSql')
const formatDate = require("../helpers/formatDate")
const calculateTimeElapsed = require("../helpers/calculateTimeElapsed")
const {editUser, editPassword, editStyle} = require('../sql/setSql')
const {schemaSettings, schemaResetPassword} = require("../helpers/validation")
const {comparePassword, hashPassword} = require("../helpers/auth")
const dotenv = require('dotenv').config()

class UserController {

    async profileController(req, res){

        const urlUserName = req.params.username.slice(1)

        const user = await selectUser(urlUserName, "UserName")

        const authUserId = req.session.user ? req.session.user.Id : null

        if (user === undefined){
            res.render('error')
            return
        }

        const userLinks = await selectUserLinks(user.Id, "UserId")
        const userStyles = await selectUserStyles(user.Id, "UserId")
        const userQuestions = await selectUserQuestions(user.Id)

        console.log(userQuestions)

        const didILiked = (questionLikes) => {
            let yes = 0
            questionLikes.forEach(el => {
                if (el.UserId === authUserId){
                    yes = 1
                }
            })
            return yes
        }

        for (const question of userQuestions){
            const questionLikes = await selectQuestionLikes(question.Id)

            question.LikeInfo = didILiked(questionLikes)
            
            if (question.AnsweredDate){
                const now = new Date()
                question.TimeElapsed = calculateTimeElapsed(now, question.AnsweredDate)
            } 
        }

        // for (const question of userQuestions) {
        //     const questionerUser = await selectUser(question.QuestionerId, "Id");
        //     const questionLikes = await selectQuestionLikes(question.Id)

        //     question.Questioner = {
        //         QuestionerName: questionerUser.Name,
        //         QuestionerSurname: questionerUser.Surname,
        //         QuestionerUserName: questionerUser.UserName
        //     }

        //     question.LikeInfo = {
        //         Likes: questionLikes.length,
        //         ILiked: didILiked(questionLikes)
        //     }

        //     if (question.AnsweredDate){
        //         const now = new Date()
        //         question.TimeElapsed = calculateTimeElapsed(now, question.AnsweredDate)
        //     }
        // }

        user.Links = userLinks ? userLinks : []
        user.Styles = userStyles[0] ? userStyles[0] : []
        user.Questions = userQuestions ? userQuestions : []
        user.JoinDate = formatDate(user.JoinDate)

        res.render('profile', {user}) 
    } 

    async settingsController(req, res, next){
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
            next(errors) // error middleware
        }
    }

    async resetPasswordController(req, res, next){

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
            next(errors) // error middleware
        }
    }

    async getSettingsController(req, res){
    
        const auth = req.session.auth
    
        if (auth){
            const user = req.session.user
            const userStyles = await selectUserStyles(user.Id, "UserId")
            user.Styles = userStyles[0]
            res.render('settings', user)
        } else{
            res.render('error')
        }
    }
    
    async changeStyleController(req, res){
        const {bgColor, borderStyle, linkColor} = req.body
        const userId = req.session.user.Id

        try {

            const existStyle = await selectExistStyles(userId, "UserId")
            if (existStyle.existStyle){
                const result = await editStyle(userId, bgColor, borderStyle, linkColor)
                if (result.error){
                    return res.json({errorSql: "Stiller kaydedilirken bir sorun oluştu."})
                }
                return res.json({message: "Stilleriniz kaydedildi."})
            }

            const result = await insertStyle(userId, bgColor, borderStyle, linkColor)
            if (result.error){
                return res.json({errorSql: "Stiller eklenirken bir sorun oluştu."})
            }
            return res.json({message: "Stilleriniz kaydedildi."})

        } catch (errors) {
            next(errors)
        }
    }

}

module.exports = new UserController()
