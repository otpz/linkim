const {selectPages} = require('../sql/selectSql')

class PageController{

    async getPageController(req, res){

        const page = req.params.slug

        const result = await selectPages(page)
        if (result){
            return res.render(page, {result})
        } else {
            return res.render("error")
        }
    } 
}

module.exports = new PageController()