import User from '../model/user.model.js';
import bcrypt from 'bcrypt';
import generateToken from "../utils/createToken.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const ifUserExists = await User.findOne({ email });
        if (ifUserExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        generateToken(res, newUser._id);

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
            return res.status(401).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, isUserExist.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        generateToken(res, isUserExist._id);

        res.status(200).json({
            _id: isUserExist._id,
            username: isUserExist.username,
            email: isUserExist.email
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: "logged out successfully" });
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};