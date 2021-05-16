const express = require('express');
const getRoutes = express.Router();
const chatsController = require('../controllers/chats-controller');
const auth = require('../middlewares/authenticate');

getRoutes.get('/friend', chatsController.friend);
getRoutes.get('/friendsList', chatsController.friendsList);
getRoutes.get('/getToken', chatsController.getToken);

module.exports = getRoutes;