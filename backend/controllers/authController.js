const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. User Register Logic
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check agar user pehle se exist karta hai
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email pehle se registered hai!" });

        // Password ko hash (encrypt) karein
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya user save karein
        await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. User Login Logic
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // User dhoondhein
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Galti: User nahi mila!" });

        // Password match karein
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Galat password!" });

        // JWT Token generate karein
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'SecretKey123', { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registerUser, loginUser };