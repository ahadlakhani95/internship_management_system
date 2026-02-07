import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Student from "../models/Student.model.js";
import Company from "../models/Company.model.js";

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// REGISTER
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        // Create role-based profile
        if (role === "STUDENT") {
            await Student.create({ userId: user._id });
        }

        if (role === "COMPANY") {
            await Company.create({ userId: user._id, companyName: name });
        }

        res.status(201).json({
            message: "Registration successful",
            token: generateToken(user),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        res.json({
            message: "Login successful",
            token: generateToken(user),
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
