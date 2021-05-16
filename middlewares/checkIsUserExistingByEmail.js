const users = require('../models/users.model');

exports.check = async (req, res, next) => {
    const userByEmail = await users.getUserByEmail(req.body.email);
    const byUsername = await users.findByUsername(req.body.username);

    if (userByEmail === null && byUsername === undefined) {
        next()
    } else if (userByEmail === null && byUsername) {
        res.render('register', {
            emailError: ``,
            usernameError: 'username already registered',
            email: '',
            passwordError: ''
        });
    } else if (userByEmail !== null && byUsername === undefined) {
        res.render('register', {
            emailError: `email already registered`,
            usernameError: '',
            email: '',
            passwordError: ''
        });
    } else if (userByEmail !== null && byUsername) {
        res.render('register', {
            emailError: `email already registered`,
            usernameError: 'username already registered',
            email: '',
            passwordError: ''
        });
    }
}

exports.checkForLogin = async (req, res, next) => {
    const userByEmail = await users.getUserByEmail(req.body.email);
    if (userByEmail === null) {
        res.render('login', {
            emailError: `no user by specified email`,
            email: '',
            passwordError: ''
        });
    } else {
        next()
    }
}