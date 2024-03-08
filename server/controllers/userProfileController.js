const selectUser = require('../sql/selectSql')

const userProfileController = async (req, res) => {
    const urlUserName = req.params.username.slice(1)

    const user = await selectUser(urlUserName, "UserName")

    let sessionUserName = req.session.user ? req.session.user.UserName : null 

    if (urlUserName === sessionUserName){
        if (req.session.auth === true){
            res.render(`profile`, {user})
        } else {
            res.redirect('/login')
            res.render('login', {authError: "Lütfen giriş yapınız."})
            return;
        }
    } else{
        res.render(`profile`, {user})
    }
} 

module.exports = userProfileController