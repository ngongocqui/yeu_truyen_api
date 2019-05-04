const Categories = require('../models/categories.model');

exports.findAllCategory = (req, res) => {
    let projection = req.body.projection

    Categories.find({}, projection)
    .then(result => {
        res.send(result)
    }).catch(err => {
        console.log("findAllCategory", err)
        res.send([])
    })
};