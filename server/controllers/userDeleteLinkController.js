const deleteUserLink = require('../sql/deleteSql')

const userDeleteLinkController = async (req, res) => {
    const id = req.params.id
    console.log("silinecek link", id)
    const result = await deleteUserLink(id)

    if (result.rowsAffected[0] === 1){
        res.json({message: "Link Silindi."})
    } else {
        res.json({error: "Link Silinemedi."})
    }
}


module.exports = userDeleteLinkController