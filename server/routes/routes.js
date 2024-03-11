const express = require('express')
const router = express.Router()
const cors = require('cors')
const dotenv = require('dotenv').config()
const path = require('path')

// controllers
const userDeleteLinkController = require('../controllers/userDeleteLinkController')
const userLoginController = require('../controllers/userLoginController')
const userRegisterController = require('../controllers/userRegisterController') 
const userProfileController = require('../controllers/userProfileController') 
const userLogoutController = require('../controllers/userLogoutController')
const {userSettingsController, userGetSettingsController} = require('../controllers/userSettingsController')
const userAddLinkController = require('../controllers/userAddLinkController')


// middleware 
router.use(
    cors({
        credentials: true,
        origin: process.env.CORS_ORIGIN_URL 
    })
)

//DELETE routes
router.delete('/deleteLink/:id', userDeleteLinkController)


//POST routes
router.post("/register", userRegisterController)
router.post("/login", userLoginController)
router.post("/settings", userSettingsController)
router.post('/addlink', userAddLinkController)

//GET routes
router.get('/', (req, res) => {
  res.render('main')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/about', (req, res) => {
  res.render('about')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/forgot', (req, res) => {
  res.render('forgot')
})

router.get('/settings', userGetSettingsController)

router.get('/logout', userLogoutController)

router.get('/:username', userProfileController)

// router.get('*' , (req, res) => {
//   res.render('error')
// })


module.exports = router
