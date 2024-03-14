const {selectPages} = require('../sql/selectSql')
const nodemailer = require("nodemailer");

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

    //send email
    async supportFormController(req, res){
        const {question} = req.body

        // const transporter = nodemailer.createTransport({
        //     service: 'Gmail',
        // })

        // if (question){
        //     res.json({message: "Sorunuz alındı."})
        // } else {
        //     res.json({error: "Bir hata oluştu. Daha sonra tekrar deneyiniz."})
        // }
    }
}

module.exports = new PageController()