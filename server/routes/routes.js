const express = require('express')
const router = express.Router()
const cors = require('cors')
const dotenv = require('dotenv').config()
const rateLimit = require('express-rate-limit')
const path = require('path')

//middleware
const authMiddleware = require('../middlewares/authMiddleware')
const generateTokenMd5 = require('../middlewares/generateToken')

// controllers
const userController = require('../controllers/userController')
const pageController = require('../controllers/pageController') 
const linkController = require('../controllers/linkController')
const authController = require('../controllers/authController')

const limiter = rateLimit({
	windowMs: 1000 * 10, // 1 minutes
	limit: 10, // Limit each IP to 10 requests per `window` (here, per 10 seconds).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  handler: (req, res, next, options) => res.status(400).json({errorRequest: "Daha fazla istek göndermeden lütfen biraz bekleyin."}),
})

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
router.post("/addlink", authMiddleware, linkController.addLinkController)
router.post("/settings/resetpassword", authMiddleware, userController.resetPasswordController)
router.post("/changestyle", authMiddleware, userController.changeStyleController)
router.post("/support", pageController.supportFormController)
router.post("/sendmail", pageController.sendMailController)
router.post("/resetforgotpassword", pageController.resetForgotPasswordController)
router.post("/ask/:username", limiter, authMiddleware, userController.sendQuestionController)
router.post("/answer/:username", limiter, authMiddleware, userController.answerQuestionController)
router.post("/deletequestion/:id", authMiddleware, userController.deleteQuestionController)

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

router.get('/discover', authMiddleware, pageController.getDiscoverPageController)

router.get("/forgot/:token", pageController.getforgotPasswordController)

router.get('/settings' ,userController.getSettingsController)

router.get('/logout', authController.logoutController)

router.get('/:username', generateTokenMd5, userController.profileController)
router.get('/page/:slug', pageController.getPageController)

// router.get('*' , (req, res) => {
//   res.render('error')
// })


module.exports = router
