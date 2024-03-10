const selectUser = require('../sql/selectSql')
const editUser = require('../sql/setSql')

const userSettingsController = async (req, res) => {
    const currentEmail = req.session.user.Email
    const currentUserName = req.session.user.UserName

    const userBody = req.body

    const existEmail = await selectUser(userBody.email, 'Email')
    const existUserName = await selectUser(userBody.username, 'UserName')

    if (existEmail && existEmail.Email && existEmail.Email !== currentEmail){
        return res.json({emailError: "Bu email adresi zaten kullanılıyor."})
    } else if (existUserName && existUserName.UserName && existUserName.UserName !== currentUserName){
        return res.json({userNameError: "Bu kullanıcı adı zaten kullanılıyor."})
    } else {
        const result = await editUser(userBody, currentEmail)
        if (result.rowsAffected[0] === 0){
            return res.json({error: "Bir hata oluştu. Lütfen tekrar deneyin."})
        }else {
            
            const user = await selectUser(userBody.email, "Email")

            const date = new Date(user.JoinDate);
            const options = { month: 'long', day: 'numeric' };
            const formattedDate = new Intl.DateTimeFormat('tr-TR', options).format(date);

            req.session.user = {
                Email: user.Email,
                Name: user.Name,
                Surname: user.Surname,
                UserName: user.UserName,
                Biography: user.Biography,
                JoinDate: formattedDate,
            }
            
            return res.json({message: "Profiliniz başarıyla güncellendi.", username: user.UserName})
        }
    }

}

const userGetSettingsController = async (req, res) => {
    
    const auth = req.session.auth

    if (auth){
        const user = req.session.user
        res.render('settings', user)
    } else{
        res.render('error')
    }
}



module.exports = {userSettingsController, userGetSettingsController}