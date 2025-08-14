const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user', 'seller','vendor'], default: 'user' },
    bio: { type: String },
    avatar: { type: String },
    phone: { type: String },
    address: { type: String },
    gender: { type: String },
    age: { type: Number },
    isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

let UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
