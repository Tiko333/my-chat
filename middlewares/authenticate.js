const jsonwebtoken = require('jsonwebtoken');
const configs = require('../configs/configs');

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization || req.query.token;
        req.user = jsonwebtoken.verify(token, configs.SECRET);
        // let token2 = jsonwebtoken.sign({id: req.user.id}, configs.SECRET, {expiresIn: '1h'})
        // req.headers.authorization = token2;
        next();
    } catch (error) {
        res.render('login', {passwordError: '', email: '', emailError: ''});
    }
}

module.exports = authenticate;