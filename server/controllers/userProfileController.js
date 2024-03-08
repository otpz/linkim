

const userProfileController = async (req, res) => {

    if (req.session.auth === true){
        res.render('profile', {user: req.session.user})
    } else {
        res.render('login', {message: "Lütfen giriş yapınız."})
    }
} 

module.exports = userProfileController