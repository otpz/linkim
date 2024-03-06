
// login endpoint
const loginUser = async (req, res) => {
    const {email, password} = req.body

    console.log(email, password)

    res.json({email: email, password: password})
}

// register endpoint
const registerUser = async (req, res) => {
    const {name, surname, username, email, password} = req.body

    res.json({name, surname, username, email, password})
}

module.exports = {loginUser, registerUser}