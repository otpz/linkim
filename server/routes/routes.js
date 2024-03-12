const express = require('express')
const router = express.Router()
const cors = require('cors')
const dotenv = require('dotenv').config()
const path = require('path')

// controllers
const userController = require('../controllers/userController')

// middleware 
router.use(
    cors({
        credentials: true,
        origin: process.env.CORS_ORIGIN_URL
    })
)

//DELETE routes
router.delete('/deleteLink/:id', userController.deleteLinkController)


//POST routes
router.post("/register", userController.registerController)
router.post("/login", userController.loginController)
router.post("/settings", userController.settingsController)
router.post('/addlink', userController.addLinkController)

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

router.get('/settings', userController.getSettingsController)

router.get('/logout', userController.logoutController)

router.get('/:username', userController.profileController)

// router.get('*' , (req, res) => {
//   res.render('error')
// })


module.exports = router
