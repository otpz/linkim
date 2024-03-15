const {selectPages} = require('../sql/selectSql')

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
}

module.exports = new PageController()