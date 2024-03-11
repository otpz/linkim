const {insertLink} = require('../sql/insertSql')

const userAddLinkController = async (req, res) => {

    const {title, link} = req.body

    const id = req.session.user ? req.session.user.Id : null

    if (id){
        if (!title || !link){
            return res.json({error: 'Lütfen bir başlık ve URL adresi girin.'})
        }
        
        const result = await insertLink(id, title, link)
    
        if (result.rowsAffected[0] === 1){
            return res.json({message: "URL Adresi başarıyla eklendi."})
        } else {
            return res.json({error: "Bir hata oluştu."})
        }
    } else {
        return res.json({error: "Lütfen giriş yapın."})
    }
}

module.exports = userAddLinkController