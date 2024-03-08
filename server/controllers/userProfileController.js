const selectUser = require('../sql/selectSql')

const userProfileController = async (req, res) => {

    const urlUserName = req.params.username.slice(1)
    let sessionUserName = req.session.user ? req.session.user.userName : null 

    if (urlUserName === sessionUserName){
        if (req.session.auth === true){
            res.render(`profile`, {user: req.session.user})
        } else {
            // res.redirect('/login')
            res.render('login', {authError: "Lütfen giriş yapınız."})
            return;
        }
    } else{
        const user = await selectUser(urlUserName, "UserName")
        if (user){
            res.render(`otherProfile`, {user})
        } else {
            res.render('error')
        }
    }
} 

module.exports = userProfileController