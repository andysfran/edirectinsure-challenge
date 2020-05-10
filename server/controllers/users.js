const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const router = express.Router();
const { validateParams, isLoggedIn }  = require('../utils/validations');

const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// Signup
router.post('/signup', validateParams([
    { 'param_key': 'name', param_name: 'Name', required: true },
    { 'param_key': 'email', param_name: 'E-mail', required: true },
    { 'param_key': 'password', param_name: 'Password', required: true },
]), (req, res) => {
    const { md5Hash } = require('../utils/hash');
    const { name, email, password } = req.body;

    client.connect(async err => {
        if (err) res.status(500).send({ success: false, message: 'Cannot connect with database.' });
        const UserModel = require('../models/User');
        const insertUser = await UserModel.addUser(client, {
            name,
            email,
            password: md5Hash(password),
            create_date: Date.now()
        });
        const httpCode = insertUser.success? 200 : 500;
        res.status(httpCode).send(insertUser);
    });
});

// Login user
router.post('/login', validateParams([
    { 'param_key': 'email', param_name: 'E-mail', required: true },
    { 'param_key': 'password', param_name: 'Password', required: true },
]), (req, res) => {
    const { md5Hash } = require('../utils/hash');
    const { email, password } = req.body;

    client.connect(async err => {
        if (err) res.status(500).send({ success: false, message: 'Cannot connect with database.' });
        const UserModel = require('../models/User');
        const resLogin = await UserModel.loginUser(client, { email, password: md5Hash(password) });
        if (resLogin.success) {
            req.session.user = resLogin.user;
        }
        res.status(200).send(resLogin);
    });
});

// Logout
router.get('/logout', (req, res) => {
    if (typeof req.session.user === "object" && req.session.user._id) {
        req.session.user = undefined;
    }
    res.send({ success: true, message: 'Logout successfully!' });
});

// Get user info
router.get('/user', (req, res) => {
    if (isLoggedIn(req)) {
        res.send({ success: true, user: req.session.user });
    } else {
        res.send({ success: false, user: {} });
    }
});

module.exports = router;
