const mongoose = require('mongoose');

const CategoriesSchema = mongoose.Schema({
    title: String,
    key: String,
    description: String
}, {
    timestamps: true
});

module.exports = mongoose.model('categories', CategoriesSchema);