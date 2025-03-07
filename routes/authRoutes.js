const router = require('express').Router();
const { registerController, loginController, generateOtpController, changePasswordController } = require('../controller/authController');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');

// Register
router.post('/register', registerController)

// Login
router.post('/login', loginController)

// test login
router.get('/test', requireSignIn, isAdmin, (req, res) => {
    console.log("You have logged in")
    res.send("Logged in ")
})

// Protected user route auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).json({ ok: true })
})

// Protected admin route auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).json({ ok: true })
})

// Generate otp
router.post('/generate-opt', generateOtpController);

// Change password
router.post('/change-password', changePasswordController);


module.exports = router