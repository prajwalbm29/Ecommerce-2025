const userModel = require('../models/userModel');
const JWT = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../helpers/authHelper')

const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Checking validation
        if (!name) {
            return res.status(400).json({ message: "Name is required." });
        }
        if (!email) {
            return res.status(400).json({ message: "email is required." });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required." });
        }
        if (!phone) {
            return res.status(400).json({ message: "Phone number is required." });
        }
        if (!address) {
            return res.status(400).json({ message: "Address is required." });
        }

        // Checking existing user
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(200).json({ success: false, message: "User already exist. Please login." });
        }

        // hashing password
        const hashedPassword = hashPassword(password);

        // saving user
        const user = await new userModel({ name, email, address, phone, password: hashedPassword }).save();

        return res.status(201).json({ success: true, message: "user registration successful.", user })
    } catch (error) {
        console.log("Error in register controller", error);
        res.status(500).json({
            success: false,
            message: "Error in Registeration",
            error
        })
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const user = await userModel.findOne({ email });
        if (!user)
            return res.status(404).json({ success: false, message: "email not found." })
        const match = comparePassword(password, user.password)
        if (!match)
            return res.status(401).json({ success: false, message: "Invalid credentials." })

        // token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ 
            success: true, 
            message: "login successful.", 
            user: { name: user.name, email: user.email, phone: user.phone, address: user.address }, 
            token,
        })
    } catch (error) {
        console.log("Error in login controller", error);
        return res.status(500).json({ success: false, message: "Error in login", error })
    }
}

module.exports = {
    registerController,
    loginController,

}