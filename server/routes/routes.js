const express = require('express')
const router = express.Router()
const cors = require('cors')
const dotenv = require('dotenv').config()
const path = require('path')

//middleware
const authMiddleware = require('../middlewares/authMiddleware')
const generateTokenMd5 = require('../middlewares/generateToken')

// controllers
const userController = require('../controllers/userController')
const pageController = require('../controllers/pageController') 
const linkController = require('../controllers/linkController')
const authController = require('../controllers/authController')

// middleware 
router.use(
    cors({
        credentials: true,
    })
)

//DELETE routes
router.delete('/deleteLink/:id', authMiddleware, linkController.deleteLinkController)

//POST routes
router.post("/register", authController.registerController)
router.post("/login", authController.loginController)
router.post("/settings", authMiddleware, userController.settingsController)
router.post('/addlink', authMiddleware, linkController.addLinkController)
router.post("/settings/resetpassword", authMiddleware, userController.resetPasswordController)
router.post("/support", pageController.supportFormController)

//GET routes
router.get('/', (req, res) => {
  res.render('main')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/forgot', (req, res) => {
  res.render('forgot')
})

router.get('/settings' ,userController.getSettingsController)

router.get('/logout', authController.logoutController)

router.get('/:username', generateTokenMd5, userController.profileController)
router.get('/page/:slug', pageController.getPageController)

// router.get('*' , (req, res) => {
//   res.render('error')
// })


module.exports = router
