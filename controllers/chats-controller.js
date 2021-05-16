const users = require('../models/users.model');
const chats = require('../models/chat.model');


exports.register = async (req, res) => {
    const registeredUser = await users.register(req.body.username, req.body.email, req.body.password);
    if (registeredUser !== null) {
        res.set('Authorization', registeredUser.token)
        res.render('friends', {
            token: registeredUser.token,
            username: registeredUser.username,
            error: ''
        });
    }
}

exports.login = async (req, res) => {
    const loggedInUser = await users.login(req.body.email, req.body.password);
    if (loggedInUser) {
        res.set('Authorization', loggedInUser.token)
        // res.set('Authorization', req.headers.authorization)

        res.render('friends', {
            token: loggedInUser.token,
            username: loggedInUser.username,
            error: ''
        });
    } else {
        res.render('login', {
            emailError: '',
            email: req.body.email,
            passwordError: `wrong password`
        });
    }
}

exports.getToken = async (req, res) => {
    const loggedInUser = await users.getToken(req.query.username);

    if (loggedInUser) {
        res.set('Authorization', loggedInUser.token)
        res.status(200).send({
            user: loggedInUser
        })
    } else {

    }
}

exports.search = async (req, res) => {
    const loggedInUser = await users.getByUsername(req.body.username, req.body.myUsername);
    res.status(200).json({
        status: 'ok',
        code: 200,
        users: loggedInUser
    })
}

exports.addFriend = async (req, res) => {
    const friend = await users.findByUsername(req.body.friendUsername);
    const me = await users.findByUsername(req.body.myUsername);

    if (me.friends.length > 0) {
        for (let i = 0; i < me.friends.length; i++) {
            if (me.friends[i].username === friend.username) {
                return res.status(200).json({
                    status: 'ok',
                    code: 200,
                    error: 'user already your friend'
                })
            }
            if (me.friends[i].username !== friend.username && i === me.friends.length - 1) {
                me.friends.push(friend);
                await me.save();

                return res.status(200).json({
                    status: 'ok',
                    code: 200,
                    error: ''
                })
            }
        }
    } else {
        me.friends.push(friend);
        await me.save();

        return res.status(200).json({
            status: 'ok',
            code: 200,
            error: ''
        })
    }
}

exports.index = async (req, res) => {
    let messages = await chats.findMessages(req.query.username, req.query.friendUsername);

    res.set('Authorization', req.query.token)
    // res.set('Authorization', req.headers.authorization)

    res.render('index', {
        username: req.query.username,
        friend: req.query.friend,
        friendUsername: req.query.friendUsername,
        messages
    });
}

exports.friends = (req, res) => {
    res.render('friends', {
        error: '',
    });
}

exports.friend = async (req, res) => {
    const friend = await users.findByUsername(req.query.friendUsername);
    // res.set('Authorization', req.headers.authorization)

    res.status(200).json({
        status: 'ok',
        code: 200,
        friend,
        username: req.query.myUsername
    })
}

exports.friendsList = async (req, res) => {
    const me = await users.findByUsername(req.query.myUsername);
    res.set('Authorization', me.token)
    res.status(200).json({
        status: 'ok',
        code: 200,
        friends: me.friends
    })
}

exports.registerGet = (req, res) => {
    res.render('register', {usernameError: '', email: '', emailError: ''});
}

exports.loginGet = (req, res) => {
    res.render('login', {passwordError: '', email: '', emailError: ''});
}