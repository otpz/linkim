const {insertLink} = require('../sql/insertSql')
const deleteUserLink = require('../sql/deleteSql')
const {selectExistLinks} = require('../sql/selectSql')
const {schemaLinkUrl} = require('../helpers/validation')
class LinkController {

    async addLinkController(req, res){
        
        const {title, link} = req.body
        
        const id = req.session.user ? req.session.user.Id : null

        try {
            await schemaLinkUrl.validate(req.body, {abortEarly: false})
            
            if (id){
                const result = await insertLink(id, title, link)
                if (result.message){
                    return res.json({message: "URL Adresi başarıyla eklendi."})
                } else {
                    return res.json({error: "Bir hata oluştu."})
                }
            } else {
                return res.json({error: "Lütfen giriş yapın."})
            }

        } catch (errors) {
            if (errors.name === "ValidationError"){
                const errorMessages = errors.inner.map(error => error.message)
                console.log(errorMessages)
                return res.json({errorValidation: errorMessages})        
            }
            return res.json({error: errors})
        }
    }

    async deleteLinkController(req, res){
        const id = req.params.id

        try {
            const userId = req.session.user ? req.session.user.Id : null // giriş yapan kullanıcı id'si

            if (!userId){
                res.json({error: "Lütfen Giriş Yapın."})
            }
            
            const exist = await selectExistLinks(userId, "UserId", id, "Id")

            if (!exist['']){
                return res.json({error: "Link Bulunamadı."})
            }

            const result = await deleteUserLink(id)

            if (result.message){
                return res.json({message: "Link Silindi."})
            } else {
                return res.json({error: "Link Silinemedi."})
            }
        } catch (error) {
            
        }
    }

}

module.exports = new LinkController()