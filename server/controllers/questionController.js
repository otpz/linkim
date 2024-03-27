const {selectUser, selectUserQuestions, selectExistQuestion, selectExistLike, selectLikedQuestion} = require('../sql/selectSql')
const {insertQuestion, insertQuestionLike, insertQuestionReport} = require('../sql/insertSql')
const {deleteUserQuestion, deleteQuestionLike, deleteQuestionAllLikes} = require('../sql/deleteSql')
const {editQuestion} = require('../sql/setSql')
const {schemaText} = require("../helpers/validation")

class QuestionController {

    async sendQuestionController(req, res, next){

        const {question, anonymously} = req.body

        try {
            await schemaText.validate(req.body, {abortEarly: false})
            const questioner = req.session.user
            const user = await selectUser(req.params.username, "UserName") // soru sorulan

            if (!user){
                return res.json({error: "Kullanıcı bulunamadı"})
            }

            const questionerId = !anonymously ? questioner.Id : null

            const result = await insertQuestion(user.Id, questionerId, question)

            if (result.error){
                return res.json({error: "Soru gönderilirken bir sorun oluştu."})
            }
            return res.json({message: "Sorunuz gönderildi."})

        } catch (errors) {
            console.log(errors)
            next(errors)
        }

    }

    async answerQuestionController(req, res, next){
        const {answer, question_id} = req.body

        try {
            await schemaText.validate({question: answer}, {abortEarly: false})

            const question = await selectUserQuestions(question_id, "Id")

            if (!question){
                return res.json({error: "Soru bulunamadı"})
            }

            const result = await editQuestion(question_id, answer)
            if (result.error){
                return res.json({errorSql: "Bir hata oluştu. Lütfen tekrar deneyin."})
            }
            return res.json({message: "Cevabınız kaydedildi."})

        } catch (errors) {
            console.log(errors)
            next(errors)
        }
    }

    async deleteQuestionController(req, res, next){
        
        const questionId = req.params.id
        const userId = req.session.user.Id

        const exist = await selectExistQuestion(userId, questionId)

        if (!exist.question){
            return res.json({error: "Soru bulunamadı." })
        }

        const result = await deleteUserQuestion(questionId)

        if (result.error){
            return res.json({error: "Soru silinirken bir hata oluştu."})
        }

        const deleteResult = await deleteQuestionAllLikes(questionId)

        if (deleteResult.error){
            return res.json({error: "Sorunun etkileşimleri silinemedi."})
        }

        return res.json({message: "Soru silindi."})
    }

    async likeQuestionController(req, res, next){
        const questionId = req.params.id
        const userId = req.session.user ? req.session.user.Id : null
        
        if (!userId){
            res.render("error")
        }
        
        try {
            
            const question = await selectLikedQuestion(questionId)

            if (question[0].Answer === null){
                return res.json({error: "Soru bulunamadı"})
            }

            const exist = await selectExistLike(questionId, userId)
            
            if (exist.questionLike){
                const result = await deleteQuestionLike(questionId, userId) // like'ı geri al
                if (result.error){
                    return res.json({error: "Bir sorun oluştu."})
                }
                return res.json({unliked: "Beğeni geri alındı."})
            }

            const result = await insertQuestionLike(questionId, userId)
            if (result.error){
                return res.json({error: "Bir sorun oluştu."})
            }

            res.json({liked: "Beğeni kaydedildi"})
            
        } catch (errors) {
            next(errors)
        }
    }

    async reportQuestionController(req, res, next){
        const questionId = req.params.id
        const reportMessage = "sss mesaj."
        try {
            const result = await insertQuestionReport(questionId, reportMessage)
            if (result.error){
                return res.json({error: "Rapor gönderirken bir sorun oluştu."})
            }
            return res.json({message: "Raporunuz gönderildi."})
        } catch (errors) {
            next(errors)
        }
    }

}

module.exports = new QuestionController()