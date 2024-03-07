

const userProfileController = async (req, res) => {
    const {token} = req.cookies 
    if (token){
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err
            res.json(user)
        })
    } else {
        res.json(null)
    }
} 



module.exports = userProfileController