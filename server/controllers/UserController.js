const UserModel = require('../models/User.Model');
const bcrypt = require('bcrypt');
const GenerateToken = require('../utils/GenerateToken');

class UserController {
    static async register(req, res) {
        try {
            let { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters' });
            }

            let existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            let salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(password, salt);

            let user = await UserModel.create({ name, email, password: hashedPassword });

            let token = GenerateToken(user);
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
                sameSite: 'lax',
                secure: false
            });

            user.password = undefined;

            return res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }

    static async login(req, res) {
        try {
            let { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            let user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            let isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            let token = GenerateToken(user);
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
                sameSite: 'lax',
                secure: false
            });

            user.password = undefined;

            return res.status(200).json({
                message: 'User logged in successfully',
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }

    static async logout(req, res) {
        try {
            res.clearCookie('token');
            return res.status(200).json({ message: 'User logged out successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }

    static async allUsers(req, res) {
        try {
            const users = await UserModel.find();
            return res.status(200).json({ users, message: 'Users fetched successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }

    
}

module.exports = UserController;
