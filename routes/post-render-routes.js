const express = require('express');
const postRoutes = express.Router();
const chatsController = require('../controllers/chats-controller');
const checkEmail = require('../middlewares/checkIsUserExistingByEmail');
const auth = require('../middlewares/authenticate');

postRoutes.post('/register', checkEmail.check, chatsController.register);
postRoutes.post('/login', checkEmail.checkForLogin, chatsController.login);

module.exports = postRoutes;