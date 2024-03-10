const selectUser = require('../sql/selectSql')

const userProfileController = async (req, res) => {

    const urlUserName = req.params.username.slice(1)

    const user = await selectUser(urlUserName, "UserName")

    if (user){

        const date = new Date(user.JoinDate);
        const options = { month: 'long', day: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('tr-TR', options).format(date);

        console.log("userDate", formattedDate)

        const sessionUserName = req.session.user ? req.session.user.UserName : null 
        
        user.JoinDate = formattedDate

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
    }else{
        res.render('error')
    }
} 

module.exports = userProfileController