const express = require('express');
const USERLOGIN = require('../models/loginModels/loginModel');
const router = express.Router();
const { setUser } = require('../config/auth');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRules');
const bcrypt = require('bcryptjs');

router.post('/user/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await USERLOGIN.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }


        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.error(`CRITICAL: Admin user ${user.email} is missing the 'role' field in the database.`);
            return res.status(500).send('Login failed: Server configuration error.');
        }

        const token = setUser(user);
        return res.send(token);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/create/user', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const existingUser = await USERLOGIN.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const userPassword = await bcrypt.hash(password, 11);
        const newUser = new USERLOGIN({ email, password: userPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.get('/get/user/role', async (req, res) => {
    try {
        const { email } = req.query; 
        const user = await USERLOGIN.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ role: user.role });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

module.exports = router;