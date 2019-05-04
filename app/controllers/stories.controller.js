const Stories = require('../models/stories.model');

exports.getLengthEpisodesStory = (req, res) => {
    let keyTitle = req.body.keyTitle

    if(keyTitle !== ""){
        Stories.aggregate([ 
            { $match: {key: keyTitle} }, 
            { $project: { "episodes.title": 1, _id: 0 } },
            { $project: 
                { 
                    length: 
                    { 
                        $cond: 
                        { 
                            if: { $isArray: "$episodes" }, then: { $size: "$episodes" }, else: 0
                        } 
                    }
                } 
            }
        ])
        .then(result => {
            res.send(result)
        }).catch(err => {
            console.log("getLengthEpisodesStory", err)
            res.send([{length: 0}])
        })
    }else{
        console.log("getLengthEpisodesStory", "lỗi")
        res.send([{length: 0}])
    }
};

exports.findEpisodesStory = (req, res) => {
    let keyTitle = req.body.keyTitle

    if(keyTitle !== ""){
        Stories.aggregate([ 
            { $match: {key: keyTitle} }, 
            { $project: { episodes: 1 } }, 
            { $unwind: "$episodes" }, 
            { $project: {
                    title: "$episodes.title",
                    key: "$episodes.key",
                    views: "$episodes.views",
                    index: "$episodes.index",
                    _id: 0
                } 
            }
        ])
        .then(result => {
            res.send(result)
        }).catch(err => {
            console.log("findEpisodesStory", err)
            res.send([])
        })
    }else{
        console.log("findEpisodesStory", "lỗi")
        res.send([])
    }
};

exports.findEpisodesStoryLimit = (req, res) => {
    let keyTitle = req.body.keyTitle
    let limit = Number(req.body.limit)
    let indexPage = Number(req.body.indexPage)
    let index = indexPage === 1 ? 0 : Number(limit*indexPage - limit)

    if(!isNaN(limit) && !isNaN(indexPage)){
        Stories.aggregate([ 
            { $match: {key: keyTitle} }, 
            { $project: { episodes: 1 } }, 
            { $unwind: "$episodes" }, 
            { $project: {
                    title: "$episodes.title",
                    key: "$episodes.key",
                    views: "$episodes.views",
                    index: "$episodes.index",
                    _id: 0
                } 
            }, 
            { $skip : index },
            { $limit : limit }
        ])
        .then(result => {
            res.send(result)
        }).catch(err => {
            console.log("findEpisodesStoryLimit", err)
            res.send([])
        })
    }else{
        console.log("findEpisodesStoryLimit", "lỗi")
        res.send([])
    }
};

exports.findReverseEpisodesStoryLimit = (req, res) => {
    let keyTitle = req.body.keyTitle
    let limit = Number(req.body.limit)
    let indexPage = Number(req.body.indexPage)
    let index = indexPage === 1 ? 0 : Number(limit*indexPage - limit)

    if(!isNaN(limit) && !isNaN(indexPage)){
        Stories.aggregate([ 
            { $match: {key: keyTitle} }, 
            { $project: { episodes: 1 } }, 
            { $project: {
                    episodes: { $reverseArray: "$episodes" }
                }
            },
            { $unwind: "$episodes" }, 
            { $project: {
                    title: "$episodes.title",
                    key: "$episodes.key",
                    views: "$episodes.views",
                    _id: 0
                } 
            }, 
            { $skip : index },
            { $limit : limit }
        ])
        .then(result => {
            res.send(result)
        }).catch(err => {
            console.log("findEpisodesStoryLimit", err)
            res.send([])
        })
    }else{
        console.log("findEpisodesStoryLimit", "lỗi")
        res.send([])
    }
};

exports.findOneEpisodesStory = (req, res) => {
    let keyTitle = req.body.keyTitle
    let keyEpisodes = req.body.keyEpisodes

    Stories.aggregate([ 
        {$match: {key: keyTitle}}, 
        {$project: {episodes: 1}}, 
        {$unwind: "$episodes"}, 
        {$match: {"episodes.key": keyEpisodes}},
        {$project: {
            title: "$episodes.title",
            key: "$episodes.key",
            images: "$episodes.images",
            _id: 0
        }}, 
    ])
    .then(result => {
        res.send(result)
    }).catch(err => {
        console.log("findOneEpisodesStory", err)
        res.send([])
    })
};

exports.findDetailStory = (req, res) => {
    let projection = req.body.projection
    let key = req.body.key

    Stories.find({key: key}, projection)
    .then(result => {
        res.send(result)
    }).catch(err => {
        console.log("findDetailStory", err)
        res.send([])
    })
};

exports.findAllStorySearchByKeyword = (req, res) => {
    let keySearch = req.body.keySearch
    let limit = Number(req.body.limit)
    let projection = req.body.projection
    let indexPage = Number(req.body.indexPage)
    let index = indexPage === 1 ? 0 : Number(limit*indexPage - limit)

    if(!isNaN(limit) && !isNaN(indexPage)){
        Stories.find({"title": {$regex: ".*"+keySearch+".*", $options: "i"}}, projection)
        .sort({ dateupdate: -1 })
        .limit(limit).skip(index)
        .then(result => {
            res.send(result)
        }).catch(err => {
            console.log("findAllStorySearchByKeyword", err)
            res.send([])
        })
    }else{
        res.send([])
    }
};

exports.findStorySort = (req, res) => {
    let limit = Number(req.body.limit)
    let projection = req.body.projection
    let indexPage = Number(req.body.indexPage)
    let index = indexPage === 1 ? 0 : Number(limit*indexPage - limit)
    let sort = req.body.sort // { dateupdate: -1 } hoặc { numberepisodes: -1 } hoặc { views: -1 } 

    if(!isNaN(limit) && !isNaN(indexPage)){
        Stories.find({}, projection).sort(sort).limit(limit).skip(index)
        .then(result => {
            res.send(result)
        }).catch(err => {
            console.log("findStorySort", err)
            res.send([])
        })
    }else{
        res.send([])
    }
};

exports.findStoryFilterAndSort = (req, res) => {
    let queryCategory = req.body.queryCategory
    let sort = req.body.sort // { dateupdate: -1 } hoặc { numberepisodes: -1 } hoặc { views: -1 } 
    let limit = Number(req.body.limit)
    let projection = req.body.projection
    let indexPage = Number(req.body.indexPage)
    let index = indexPage === 1 ? 0 : Number(limit*indexPage - limit)

    if(!isNaN(limit) && !isNaN(indexPage)){
        Stories.find({"category.key": { $all: queryCategory}}, projection).sort(sort).limit(limit).skip(index)
        .then(result => {
            res.send(result)
        }).catch(err => {
            console.log("findStoryFilterAndSort", err)
            res.send([])
        })
    }else{
        res.send([])
    }
};

exports.findPaginationStorySort = (req, res) => {
    let limit = Number(req.body.limit)
    let projection = req.body.projection

    if(!isNaN(limit)){
        Stories.find({}, projection).count()
        .then(result => {
            let page = Math.ceil(result/limit)
            res.send([{page: page}])
        }).catch(err => {
            console.log("findPaginationStorySort", err)
            res.send([{page: 0}])
        })
    }else{
        res.send([{page: 0}])
    }
};

exports.findPaginationStoryFilterAndSort = (req, res) => {
    let limit = Number(req.body.limit)
    let queryCategory = req.body.queryCategory
    let projection = req.body.projection

    if(!isNaN(limit)){
        Stories.find({"category.key": { $all: queryCategory}}, projection).count()
        .then(result => {
            let page = Math.ceil(result/limit)
            res.send([{page: page}])
        }).catch(err => {
            console.log("findPaginationStoryFilterAndSort", err)
            res.send([{page: 0}])
        })
    }else{
        res.send([{page: 0}])
    }
};

exports.findStoryFullSort = (req, res) => {
    let limit = Number(req.body.limit)
    let projection = req.body.projection
    let indexPage = Number(req.body.indexPage)
    let index = indexPage === 1 ? 0 : Number(limit*indexPage - limit)
    let sort = req.body.sort // { dateupdate: -1 } hoặc { numberepisodes: -1 } hoặc { views: -1 } 

    if(!isNaN(limit) && !isNaN(indexPage)){
        Stories.find({status: "Hoàn thành"}, projection).sort(sort).limit(limit).skip(index)
        .then(result => {
            res.send(result)
        }).catch(err => {
            console.log("findStoryFullSort", err)
            res.send([])
        })
    }else{
        res.send([])
    }
};

exports.findStoryFullFilterAndSort = (req, res) => {
    let queryCategory = req.body.queryCategory
    let sort = req.body.sort // { dateupdate: -1 } hoặc { numberepisodes: -1 } hoặc { views: -1 } 
    let limit = Number(req.body.limit)
    let projection = req.body.projection
    let indexPage = Number(req.body.indexPage)
    let index = indexPage === 1 ? 0 : Number(limit*indexPage - limit)

    if(!isNaN(limit) && !isNaN(indexPage)){
        Stories.find({"category.key": { $all: queryCategory}, status: "Hoàn thành"}, projection).sort(sort).limit(limit).skip(index)
        .then(result => {
            res.send(result)
        }).catch(err => {
            console.log("findStoryFullFilterAndSort", err)
            res.send([])
        })
    }else{
        res.send([])
    }
};

exports.findPaginationStoryFullSort = (req, res) => {
    let limit = Number(req.body.limit)
    let projection = req.body.projection

    if(!isNaN(limit)){
        Stories.find({status: "Hoàn thành"}, projection).count()
        .then(result => {
            let page = Math.ceil(result/limit)
            res.send([{page: page}])
        }).catch(err => {
            console.log("findPaginationStoryFullSort", err)
            res.send([{page: 0}])
        })
    }else{
        res.send([{page: 0}])
    }
};

exports.findPaginationStoryFullFilterAndSort = (req, res) => {
    let limit = Number(req.body.limit)
    let queryCategory = req.body.queryCategory
    let projection = req.body.projection

    if(!isNaN(limit)){
        Stories.find({"category.key": { $all: queryCategory}, status: "Hoàn thành"}, projection).count()
        .then(result => {
            let page = Math.ceil(result/limit)
            res.send([{page: page}])
        }).catch(err => {
            console.log("findPaginationStoryFullFilterAndSort", err)
            res.send([{page: 0}])
        })
    }else{
        res.send([{page: 0}])
    }
};

exports.findEpisodesLength = (req, res) => {
    let key = req.body.key

    Stories.aggregate([
        { $match: { key: key } },
        {
            $project: {
                _id: 0,
                numberOfEpisodes: { 
                    $cond: { 
                        if: { 
                            $isArray: "$episodes" 
                        }, 
                        then: 
                        { 
                            $size: "$episodes" 
                        }, 
                        else: 0
                    } 
                }
            }
        }
    ])
    .then(result => {
        if(result && result.length > 0){
            res.send(result[0])
        }else{
            res.send({numberOfEpisodes: 0})
        }
    }).catch(err => {
        console.log("findEpisodesLength", err)
        res.send({numberOfEpisodes: 0})
    })
};

exports.connect = (req, res) => {
    res.send({message: "ok"})
};