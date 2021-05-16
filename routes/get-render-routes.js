const express = require('express');
const getRoutes = express.Router();
const chatsController = require('../controllers/chats-controller');
const auth = require('../middlewares/authenticate');

getRoutes.get('/', chatsController.loginGet);
getRoutes.get('/index', auth, chatsController.index);
getRoutes.get('/friends', auth, chatsController.friends);
getRoutes.get('/register', chatsController.registerGet);
getRoutes.get('/login', chatsController.loginGet);

module.exports = getRoutes;