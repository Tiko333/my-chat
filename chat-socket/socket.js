const chats = require('../models/chat.model');
const users = require('../models/users.model');

exports.socket = (server) => {
    const io = require("socket.io")(server)

    io.on('connection', (socket) => {
        console.log('New user connected')

        socket.on('user_room', async (data) => {
            const chat = await chats.create(data.username, data.friendUsername);

            if (chat) {
                socket.join(chat.room);
            }

            socket.on('new_message', (data) => {
                io.to(chat.room).emit('new_message', {message : data.message, username : socket.username});
                chats.addMessage(chat, data.message, data.username, data.friendUsername);

                socket.broadcast.emit('friends_new_message', data.username);
            })

            socket.on('typing', (data) => {
                socket.broadcast.to(chat.room).emit('typing', {username : socket.username});
            })

            socket.on('not typing', (data) => {
                socket.broadcast.to(chat.room).emit('not typing');
            })

        })

        socket.on('change_username', (data) => {
            socket.username = data.username
        })

        socket.on('friend_adding', async (data) => {
            await users.addFriend(data.myUsername, data.friendUsername);
            socket.broadcast.emit('friend_adding', {username: data.myUsername, friendUsername: data.friendUsername});
        })
    })
}