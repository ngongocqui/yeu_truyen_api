const mongoose = require('mongoose');

const StoriesSchema = mongoose.Schema({
    title: String,
    otherTitle: String,
    key: String,
    author: String,
    status: String,
    content: String,
    category: Array,
    views: Intl,
    episodes: Array,
    img: String,
    episodesUpdate: String,
    numberepisodes: Intl
}, {
    timestamps: true
});

module.exports = mongoose.model('stories', StoriesSchema);