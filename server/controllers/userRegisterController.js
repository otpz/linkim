
const insertUser = require('../sql/insertSql')
const selectUser = require('../sql/selectSql')

// register endpoint
const userRegisterController = async (req, res) => {
    const {name, surname, username, email, password} = req.body
    try {
        
        const user = await selectUser(email)

        if (user){
            if (user.UserName === username){
                return res.json({error: "Bu kullanıcı adı zaten kullanımda."})
            } else if (user.Email === email){
                return res.json({error: "Bu email zaten kullanımda."})
            }
        }

        const result = await insertUser(name, surname, username, email, password)

        if (result.name === "RequestError"){
            return res.json({error: "RequestError"})
        }

        return res.json({message: "Kayıt başarıyla oluşturuldu"})

    } catch (error) {
        console.log(error)
        return res.json({error: error})        
    }
}

module.exports = {userRegisterController}
