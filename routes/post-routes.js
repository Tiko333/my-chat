const express = require('express');
const postRoutes = express.Router();
const chatsController = require('../controllers/chats-controller');
const auth = require('../middlewares/authenticate');

postRoutes.post('/search', chatsController.search);
postRoutes.post('/addFriend', chatsController.addFriend);

module.exports = postRoutes;