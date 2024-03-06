const express = require('express')
const router = express.Router()
const cors = require('cors')
const dotenv = require('dotenv').config()

// controllers
const { userLoginController } = require('../controllers/userLoginController')
const { userRegisterController } = require('../controllers/userRegisterController') 

// middleware 
router.use(
    cors({
        credentials: true,
        origin: process.env.CORS_ORIGIN_URL
    })
)

router.post("/register.html", userRegisterController)
router.post("/login.html", userLoginController)

module.exports = router
