const express = require('express')
const router = express.Router()
const cors = require('cors')
const dotenv = require('dotenv').config()
const path = require('path')

const userProfileController = require('../controllers/userProfileController')

// middleware 
router.use(
    cors({
        credentials: true,
        origin: process.env.CORS_ORIGIN_URL 
    })
)

router.get('/:username', userProfileController)

module.exports = router;