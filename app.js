if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoDB = require('./db/mongo-db-connection');
const bodyParser = require('body-parser');
const getRoutes = require('./routes/get-routes');
const getRenderRoutes = require('./routes/get-render-routes');
const postRoutes = require('./routes/post-routes');
const postRenderRoutes = require('./routes/post-render-routes');
const configs = require('./configs/configs');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(getRoutes);
app.use(getRenderRoutes);
app.use(postRoutes);
app.use(postRenderRoutes);

mongoDB.connect().then(() => {
    const server = app.listen(configs.PORT)
    console.log(`App running on http://localhost:${configs.PORT}/`)
    const {socket} = require('./chat-socket/socket');
    socket(server);
})