module.exports = {
    URL: process.env.DB_URL || 'mongodb://localhost:27017/chat',
    SECRET: process.env.JWT_SECRET_KEY,
    OPTIONS: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    PORT: process.env.PORT || 3000
}