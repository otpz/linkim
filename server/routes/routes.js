const express = require('express')
const router = express.Router()
const cors = require('cors')
const dotenv = require('dotenv').config()

// controller
const { loginUser, registerUser } = require('../controller/controller')


// middleware 
router.use(
    cors({
        credentials: true,
        origin: process.env.CORS_ORIGIN_URL
    })
)


router.post("/register.html", registerUser)
router.post("/login.html", loginUser)


module.exports = router
