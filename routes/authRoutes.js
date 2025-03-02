const router = require('express').Router();
const { registerController, loginController } = require('../controller/authController');
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

module.exports = router