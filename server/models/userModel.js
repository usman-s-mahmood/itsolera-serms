import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'cashier', 'warehouse', 'accountant'],
        default: 'cashier'
    },
    phone: {
        type: String,
        default: ''
    },
    branch: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    },
    profilePic: {
        type: String,
        default: ''
    },
    lastLogin: {
        type: Date
    }
}, {timestamps: true});

const User = mongoose.model(
    'User',
    userSchema
);

export default User;