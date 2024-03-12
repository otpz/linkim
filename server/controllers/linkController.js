const {insertLink} = require('../sql/insertSql')
const deleteUserLink = require('../sql/deleteSql')
const {selectExistLinks} = require('../sql/selectSql')

class LinkController {

    async addLinkController(req, res){

        const {title, link} = req.body
        
        const urlExpression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

        const urlRegex = new RegExp(urlExpression)

        const id = req.session.user ? req.session.user.Id : null
    
        if (id){
            if (!title || !link){
                return res.json({error: 'Lütfen bir başlık ve URL adresi girin.'})
            } else if (!link.match(urlRegex)){
                return res.json({urlError: 'Lütfen doğru bir URL adresi giriniz.'})
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
    }

    async deleteLinkController(req, res){
        const id = req.params.id

        const userId = req.session.user.Id // giriş yapan kullanıcı id'si

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
    }

}

module.exports = new LinkController()