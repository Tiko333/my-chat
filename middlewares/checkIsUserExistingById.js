const users = require('../models/users.model');

let check = async (req, res, next) => {
    const userById = await users.getById(req.body.authorId);
    if (userById !== null) {
        req.body.userByAuthorId = userById
        next()
    } else {
        res.status(400).json({
            status: 'error',
            code: 400,
            message: `user by ${req.body.authorId} id do not registered`
        });
    }
}

module.exports = check;