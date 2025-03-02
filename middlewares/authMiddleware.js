const JWT = require('jsonwebtoken');
const userModel = require('../models/userModel');

const requireSignIn = (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        console.log("Error in require sigin middleware", error);
        return res.status(401).json({ success:false, message: "Unauthorized. Please login."});
    }
}

const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user.role) {
            return res.status(401).json({ success: false, message: "Unauthorized"});
        } else {
            next();
        }
    } catch (error) {
        console.log("Error in isAdmin middleware", error);
        return res.status(401).json({
            success:false,
            message: "Unauthorized Admin",
            error
        })
    }
}

module.exports = {
    requireSignIn,
    isAdmin,

}