
const authMiddleware = (req, res, next) => {
    const user = req.session.user || {}
    const auth = req.session.auth || false

    if (user && auth){
        console.log("Doğrulanan id: ", user.Id)
        next()
    } else {
        res.json({error: "Lütfen Giriş Yapın"})
    }
}

module.exports = authMiddleware