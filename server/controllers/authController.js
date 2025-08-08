import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import logger from "../utils/logger.js";
import jwt from 'jsonwebtoken';

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
        logger.error(
            'Signup error', 
            { 
                error, 
                route: 'signup', 
                body: req.body 
            }
        );
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const login = async (req, res) => {

    try {
        const {
            identifier,
            password
        } = req.body;
        const user = await User.findOne({
            $or: [
                {username: identifier},
                {email: identifier}
            ]
        });

        if (!user)
            return res.status(404).json({error: 'User Not Found'});

        if (!user.isActive)
            return res.status(403).json({error: "Account is deactivated"});
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) 
            return res.status(401).json({error: "Invalid Credentials"});
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );

        res.cookie(
            'auth_token',
            token, {
                httpOnly: true,
                sameSite: 'Strict',
                secure: process.env.NODE_ENV !== 'production',
                maxAge: 24 * 60 * 60 * 1000
            }
        );
        user.lastLogin = new Date();
        await user.save();

        return res.status(200).json({
            message: 'Login Successful',
            user: await User.findOne({
                $or: [
                    { username: identifier },
                    { email: identifier }
                ]
            }).select('-password')
        });
    } catch (error) {
        console.error(`Login Error: ${error}`);
        logger.error(
            'Login error', 
            { 
                error, 
                route: 'login', 
                body: req.body 
            }
        );
        return res.status(500).json({error: "Internal Server Error"});
        
    }
}




















