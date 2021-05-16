const Chats = require('./schemas/chat.schema');

exports.create = async (me, fr) => {

    const query = await Chats.find({ users: { $all: [me, fr] } });
    if (query.length === 0 && me !== undefined && fr !== undefined)  {
        let newChat = new Chats({
            users: [me, fr],
            room: `${me}-${fr}`
        });

        const savedChat = await newChat.save();
        return savedChat;
    } else {
       return query[0];
    }
}

exports.addMessage = async (chat, message, username, friendUsername) => {
    chat.messages.push({username, message, date: new Date()})
    chat.save();
}

exports.findMessages = async (username, friendUsername) => {
    const query = await Chats.find({$or: [{ room: `${username}-${friendUsername}` }, { room: `${friendUsername}-${username}`}]});

    if (query.length !== 0) {
        return query[0].messages;
    }
    // return [];
    return query;
}