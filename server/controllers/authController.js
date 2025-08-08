import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import logger from "../utils/logger.js";

export const testing = async (req, res) => {
    return res.send({"message": "Auth Routes Are Working!"});
}

export const signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            username,
            password,
            confirmPassword,
            email,
            gender,
            phone,
            branch
        } = req.body;

        if (password.toString() !== confirmPassword.toString())
            return res.status(403).json({error: 'password mismatch!'});

        const usernameCheck = await User.findOne({username});
        const emailCheck = await User.findOne({email});

        if (usernameCheck)
            return res.status(403).json({error: 'Username Must be Unique!'});

        if (emailCheck)
            return res.status(403).json({error: 'Email Must be Unique!'});

        // TODO: Handle Image Uploads to CDN and save the link in DB

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            gender,
            branch,
            phone
        });
        await newUser.save();

        return res.status(201).json({message: "User Registered Successfully!"});
    } catch (error) {
        logger.error('Signup error', { error, route: 'signup', body: req.body });
        return res.status(500).json({ error: 'Internal server error' });
    }
}
