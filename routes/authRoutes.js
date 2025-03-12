const router = require('express').Router();
const { allUsersController, changeOrderStatusController, getAllOrderController, getOrderController, updateProfileController, registerController, loginController, generateOtpController, changePasswordController } = require('../controller/authController');
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

// update profile
router.put("/profile", requireSignIn, updateProfileController);

// orders
router.get('/orders', requireSignIn, getOrderController);

// all orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrderController);

// change order status
router.put("/order-status/:orderId", requireSignIn, isAdmin, changeOrderStatusController);

// all users
router.get("/all-users", requireSignIn, isAdmin, allUsersController);


module.exports = router