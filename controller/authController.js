const userModel = require('../models/userModel');
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');
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
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            success: true,
            message: "login successful.",
            user: { name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role },
            token,
        })
    } catch (error) {
        console.log("Error in login controller", error);
        return res.status(500).json({ success: false, message: "Error in login", error })
    }
}

const generateOtpController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }
        const findUser = await userModel.findOne({ email });
        if (!findUser) return res.status(404).json({ success: false, message: "Invalid Email Id." });
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("OTP: ", otp);

        // Sending otp to mail
        const config = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        };
        const transporter = nodemailer.createTransport(config);
        const message = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Ecommerce: Change Password Email ID Verification',
            html: `
                <h2>Ecommerce: Change Password Verification</h2>
                <p>Dear User,</p>
                <p>You have requested to change your password. Please use the OTP below to verify your email ID and proceed with the password reset:</p>
                <h3 style="color: #2D89EF;">${otp}</h3>
                <p>This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.</p>
                <p>If you did not request this change, please ignore this email.</p>
                <br>
                <p>Regards,</p>
                <p><b>Ecommerce Support Team</b></p>
            `,
        };
        await transporter.sendMail(message);

        // updating database
        const hashedOtp = hashPassword(otp);
        const expireAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
        await userModel.findByIdAndUpdate(findUser._id, { changePassword: { otp: hashedOtp, expireAt: expireAt } })

        res.status(200).json({ success: true, message: "Otp sent successfully." });
    } catch (error) {
        console.log("Error in generateOtpController", error);
        res.status(500).json({ success: false, message: "Failed to generate Otp.", error });
    }
}

const changePasswordController = async (req, res) => {
    try {
        const { email, newPassword, otp } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        if (!newPassword) {
            return res.status(400).json({ success: false, message: "Password is required" });
        }
        if (!otp) {
            return res.status(400).json({ success: false, message: "OTP is required" });
        }
        const findUser = await userModel.findOne({ email });
        if (!findUser) return res.status(401).json({ success: false, message: "User not found" });
        if (Date.now() > findUser.changePassword.expireAt) return res.status(400).json({ success: false, message: "OTP Timed out" });
        if (!comparePassword(otp, findUser.changePassword.otp)) return res.status(400).json({ success: false, message: "Invalid OTP." });
        const hashedNew = hashPassword(newPassword);
        await userModel.findByIdAndUpdate(findUser._id, { password: hashedNew });
        res.status(200).json({ success:true,message:"password reset successful."})
    } catch (error) {
        console.log("error in change password", error);
        return res.status(500).json({ success: false, message: "Failed to change password", error });
    }
}

module.exports = {
    registerController,
    loginController,
    generateOtpController,
    changePasswordController,

}