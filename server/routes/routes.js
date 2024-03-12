const express = require('express')
const router = express.Router()
const cors = require('cors')
const dotenv = require('dotenv').config()
const path = require('path')

// controllers
const userController = require('../controllers/userController')
const pageController = require('../controllers/pageController') 
const linkController = require('../controllers/linkController')
const authController = require('../controllers/authController')

// middleware 
router.use(
    cors({
        credentials: true,
        origin: process.env.CORS_ORIGIN_URL
    })
)

//DELETE routes
router.delete('/deleteLink/:id', linkController.deleteLinkController)

//POST routes
router.post("/register", authController.registerController)
router.post("/login", authController.loginController)
router.post("/settings", userController.settingsController)
router.post('/addlink', linkController.addLinkController)

//GET routes
router.get('/', (req, res) => {
  res.render('main')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/page/:slug', pageController.getPageController)

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/forgot', (req, res) => {
  res.render('forgot')
})

router.get('/settings', userController.getSettingsController)

router.get('/logout', authController.logoutController)

router.get('/:username', userController.profileController)

// router.get('*' , (req, res) => {
//   res.render('error')
// })


module.exports = router
