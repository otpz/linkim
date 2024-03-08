
const insertUser = require('../sql/insertSql')
const selectUser = require('../sql/selectSql')
const {hashPassword} = require('../helpers/auth')

// register endpoint
const userRegisterController = async (req, res) => {
    const {name, surname, username, email, password} = req.body
    
    try {
        
        const user = await selectUser(email, "Email")

        if (user){
            if (user.UserName === username){
                return res.json({error: "Bu kullanıcı adı zaten kullanımda."})
            } else if (user.Email === email){
                return res.json({error: "Bu email zaten kullanımda."})
            }
        }

        const hashedPassword = await hashPassword(password)

        const result = await insertUser(name, surname, username, email, hashedPassword)

        if (result.name === "RequestError"){
            return res.json({error: "RequestError"})
        }

        return res.json({message: "Kayıt başarıyla oluşturuldu"})

    } catch (error) {
        console.log(error)
        return res.json({error: error})        
    }
}

module.exports = userRegisterController
