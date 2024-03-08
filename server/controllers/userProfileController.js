

const userProfileController = async (req, res) => {

    const username = req.params.username

    if (username === req.session.user.userName){
        if (req.session.auth === true){
            res.render(`profile`, {user: req.session.user})
        } else {
            res.redirect('/login')
            res.render('login', {authError: "Lütfen giriş yapınız."})
        }
    } else{
        res.redirect('/login')
        res.render('login', {authError: "Lütfen giriş yapınız."})
    }

    
} 

module.exports = userProfileController