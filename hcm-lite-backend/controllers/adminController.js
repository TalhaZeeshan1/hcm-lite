const User = require('../models/User');
const bcrypt = require('bcrypt');

// POST /api/users/admin/create-hr (Admin Only)
exports.createHR = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const hrUser = await User.create({
            email,
            password: hashedPassword,
            role: 'HR',
            mustChangePassword: true
        });

        res.status(201).json({ message: 'HR Account created successfully', email: hrUser.email });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};