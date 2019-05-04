const mongoose = require('mongoose');

const User = mongoose.Schema({
    providerId: String,
    name: String,
    email: String,
    picture: String,
    phoneNumber: String,
    uid: String,
    username: String,
    password: String,
    followStory: Array,
    fcmToken: Array
}, {
    timestamps: true
});

module.exports = mongoose.model('users', User);