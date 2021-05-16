const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    users: {
        type: Array,
        required: true,
        default: []
    },
    room: {
        type: String,
        required: true,
    },
    messages: {
        type: Array,
        required: true,
        default: []
    }
}, {timestamps: true});

module.exports = mongoose.model('Chats', UserSchema);