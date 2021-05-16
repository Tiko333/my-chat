const mongoose = require('mongoose');
const configs = require('../configs/configs');

// connects to mongo
exports.connect = async function () {
    await mongoose.connect(configs.URL, configs.OPTIONS).then(()=> {
        console.log('Connected to mongoDB');
    }).catch(err => {
        console.log(err)
    })
}

// disconnects from mongo and exit
exports.disconnect = function () {
    mongoose.connection.close().then(() => {
        console.log('disconnected from MongoDB')
        process.exit(0);
    })
}