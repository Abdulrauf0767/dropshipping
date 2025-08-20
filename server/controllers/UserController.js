const UserModel = require('../models/User.Model');
const bcrypt = require('bcrypt');
const GenerateToken = require('../utils/GenerateToken');

class UserController {
     async register(req, res) {
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

     async login(req, res) {
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

     async logout(req, res) {
        try {
            res.clearCookie('token');
            return res.status(200).json({ message: 'User logged out successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }

     async allUsers(req, res) {
        try {
            const users = await UserModel.find();
            return res.status(200).json({ users, message: 'Users fetched successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }


     async blockUser(req, res) {
    try {
      const userId = req.params.id;
      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.isBlocked) {
        return res
          .status(400)
          .json({ message: "User is already blocked", isBlocked: true });
      }

      user.isBlocked = true;
      await user.save();

      return res
        .status(200)
        .json({ message: "User blocked successfully", isBlocked: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  // Unblock a user
   async unblockUser(req, res) {
    try {
      const userId = req.params.id;
      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!user.isBlocked) {
        return res
          .status(400)
          .json({ message: "User is already active", isBlocked: false });
      }

      user.isBlocked = false;
      await user.save();

      return res
        .status(200)
        .json({ message: "User unblocked successfully", isBlocked: false });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  // Get all blocked users
   async getBlockedUsers(req, res) {
    try {
      const blockedUsers = await UserModel.find({ isBlocked: true });
      return res.status(200).json({ users: blockedUsers });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

 async searchUsers(req, res) {
        try {
            const query = req.query.query?.trim();

            if (!query) {
                return res.status(400).json({ message: "Search query is required" });
            }

            // Case-insensitive search on name, email, role
            const regex = new RegExp(query, 'i');
            const users = await UserModel.find({
                $or: [
                    { name: regex },
                    { email: regex },
                    { role: regex }
                ]
            });

            return res.status(200).json({
                message: 'Users fetched successfully',
                total: users.length,
                users
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Something went wrong", error: error.message });
        }
    }

    async allUsersCount (req,res) {
        try {
            let total = await UserModel.countDocuments();
            return res.status(200).json({ message: 'Users fetched successfully', total });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    async SellersCount (req,res) {
        try {
            let total = await UserModel.countDocuments({ role: "seller" });
            return res.status(200).json({ message: 'Users fetched successfully', total });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    async vendorsCount (req,res) {
        try {
            let total = await UserModel.countDocuments({ role: "vendor" });
            return res.status(200).json({ message: 'Users fetched successfully', total });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }
}


module.exports = new UserController();
