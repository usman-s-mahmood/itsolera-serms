import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import { isValidObjectId } from 'mongoose';

dotenv.config();

const adminCheck = async (req, res, next) => {
    try {
        const token = req.cookies.auth_token;
        
        if (!token) 
            return res.status(401).json({error: 'Invalid Auth Token'});

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded)
            return res.status(400).json({error: "Authentication Failed!"});

        if (!isValidObjectId(decoded.id))
            return res.status(500).json({error: 'Internal Server Error'});

        const user = await User.findById(decoded.id);

        if (!user)
            return res.status(404).json({error: 'Invalid Operation!'});
        if (user.role !== 'admin') 
            return res.status(403).json({error: "Resource Not Found!"})
        
        req.user = user;
        next();

    } catch (error) {
        console.error(`Internal Server Error At Protect Route middleware: ${error.message}`);   
        return res.status(500).json({error: 'Internal Server Error'});
    }
}
export default adminCheck;