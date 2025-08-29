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
                secure: process.env.NODE_ENV === 'production',
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

export const logout = async (req, res) => {
    try {
        const token = req.cookies?.auth_token;

        if (!token) 
            return res.status(401).json({ error: "No active session!" });

        res.cookie('auth_token', '', {
            httpOnly: true,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0)
        });

        return res.status(200).json({ message: "Logout Successful" });

    } catch (error) {
        console.error(`Logout Error: ${error}`);
        logger.error('Logout error', { error, route: 'logout' });
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const editUser = async (req, res) => {
    try {
        const userId = req.user._id; 

        const {
            firstName,
            lastName,
            username,
            email,
            phone,
            profilePic
        } = req.body;

        const user = await User.findById(userId);
        if (!user) 
            return res.status(404).json({ error: "User not found" });

        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) 
                return res.status(403).json({ error: "Username already in use" });
            
            user.username = username;
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) 
                return res.status(403).json({ error: "Email already in use" });
            user.email = email.toLowerCase();
        }

        if (phone !== undefined && phone !== user.phone && phone !== '') {
            const phoneExists = await User.findOne({ phone });
            if (phoneExists) 
                return res.status(403).json({ error: "Phone number already in use" });
            user.phone = phone;
        } 

        
        if (firstName) 
            user.firstName = firstName;
        if (lastName) 
            user.lastName = lastName;
        if (phone !== undefined) 
            user.phone = phone;
        if (profilePic !== undefined) 
            user.profilePic = profilePic;

        await user.save();
        const userQuery = await User.findById(user.id).select('-password');

        return res.status(200).json({ message: "User updated successfully", userQuery });
    } catch (error) {
        console.error('Edit user error:', error);
        console.error(`Edit user Error: ${error}`);
        logger.error('Edit user Error', { error, route: 'edit-user' });
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const editPassword = async (req, res) => {
    try {
        const userID = req.user._id;
        const {
            old_password,
            new_password,
            confirm_password
        } = req.body;

        const user = await User.findById(userID);

        if (!user)
            return res.status(404).json({error: "User Not Found"})

        const oldPasswordCheck = await bcrypt.compare(
            old_password,
            user.password
        );

        if (!oldPasswordCheck)
            return res.status(403).json({error: 'Invalid Old Password!'});

        if (new_password.toString() !== confirm_password.toString()) 
            return res.status(403).json({error: "New Password and confirm Password mismatch!"});

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(
            new_password,
            salt
        );

        user.password = await newPassword;
        await user.save();

        return res.json({message: "password updated successfully!"});

    } catch (error) {
        console.error(`Edit Password Error: ${error}`);
        logger.error('Edit Password Error', { error, route: 'edit-password' });
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const userInfo = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select('-password');

        if (!user)
            return res.status(404).json({message: "User Not Found"});

        return res.json({message: "User Found Successfully!", user});
        
    } catch (error) {
        console.error(`User Info Error: ${error}`);
        logger.error('User Info Error', { error, route: 'user-info' });
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const {password} = req.body;

        const user = await User.findById(userId);
        const passwordCheck = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordCheck)
            return res.status(403).json({error: "Password Mismatch!"});

        await User.findByIdAndDelete(userId);
        res.cookie('auth_token', '', {
            httpOnly: true,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0)
        });
        return res.json({message: 'User Deleted Successfully!'});
    } catch(error) {
        console.error(`User Delete Error: ${error}`);
        logger.error('User Delete Error', { error, route: 'delete user' });
        return res.status(500).json({ error: "Internal Server Error" });
    }
}




















