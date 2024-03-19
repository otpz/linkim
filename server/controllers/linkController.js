const {insertLink} = require('../sql/insertSql')
const deleteUserLink = require('../sql/deleteSql')
const {selectExistLinks, selectLinksLastMinutes} = require('../sql/selectSql')
const {schemaLinkUrl} = require('../helpers/validation')
const { comparePassword } = require('../helpers/auth')
class LinkController {

    async addLinkController(req, res, next){
        
        const {title, link} = req.body

        const csrfTokenHeader = req.headers["csrf-token"]
        const csrfTokenSession = req.session.csrfToken

        const isMatch = await comparePassword(csrfTokenSession, csrfTokenHeader)

        if (!isMatch){
            return res.status(400).json({error: "Doğrulanmadı!"})
        }

        const id = req.session.user ? req.session.user.Id : null

        try {
            await schemaLinkUrl.validate(req.body, {abortEarly: false})
            
            if (id){
                const links = await selectLinksLastMinutes()
                if (links.counter >= 5){
                    return res.json({errorRequest: "Daha fazla istek göndermeden lütfen biraz bekleyiniz."})
                }
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
            next(errors) // error middleware
        }
    }

    async deleteLinkController(req, res){
        const id = req.params.id

        const userId = req.session.user ? req.session.user.Id : null // giriş yapan kullanıcı id'si

        try {

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
            console.log("delete error")
        }
    }

}

module.exports = new LinkController()