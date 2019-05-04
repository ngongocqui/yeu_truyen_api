const User = require('../models/user.model');

exports.loginWithAuth = async(req, res) => {
    let email = req.body.email ? req.body.email : ""
    let uid = req.body.uid ? req.body.uid : ""

    let resultUser = await User.find({uid: uid, email: email})

    if(resultUser.length > 0){
        res.send({message: "Đăng nhập thành công!"})
    }else{
        const user = new User({
            providerId: req.body.providerId ? req.body.providerId : "",
            name: req.body.name ? req.body.name : "",
            email: req.body.email ? req.body.email : "",
            picture: req.body.picture ? req.body.picture : "",
            phoneNumber: req.body.phoneNumber ? req.body.phoneNumber : "",
            uid: req.body.uid ? req.body.uid : "",
            username: "",
            password: ""
        })
    
        user.save()
        .then(result => {
            res.send({message: "Đăng nhập thành công!"})
        }).catch(err => {
            console.log("loginWithAuth", err)
            res.send({message: "Đăng nhập thất bại!"})
        })
    }
};

exports.getDataFollowStory = (req, res) => {
    let email = req.body.email ? req.body.email : ""
    let uid = req.body.uid ? req.body.uid : ""
    let limit = Number(req.body.limit)
    let indexPage = Number(req.body.indexPage)
    let index = indexPage === 1 ? 0 : Number(limit*indexPage - limit)

    if(!isNaN(limit) && !isNaN(indexPage)){
        User.aggregate([
            { $match: { uid: uid, email: email } },
            { $project : { followStory: 1 } },
            { $unwind : "$followStory" },
            { $project : { key: "$followStory.key", updatedAt: "$followStory.updatedAt" } },
            { $lookup: {from: "stories", localField: "key", foreignField: "key", as: "data"} },
            { $project : { data: 1 } },
            { $unwind : "$data" },
            { $project : { 
                    title: "$data.title", 
                    key: "$data.key", 
                    img: "$data.img",
                    length: { $cond: { if: { $isArray: "$data.episodes" }, then: { $size: "$data.episodes" }, else: "???"} }
                }
            },  
            { $skip: index },
            { $limit: limit }
        ])
        .then(result => {
            res.send(result)
        }).catch(err => {
            console.log("getDataFollowStory", err)
            res.send([])
        })
    }else{
        console.log("getDataFollowStory", "lỗi limit và indexPage không phải là số!")
        res.send([])
    }
};

exports.checkStoryFollowStory = async(req, res) => {
    let email = req.body.email ? req.body.email : ""
    let uid = req.body.uid ? req.body.uid : ""
    let keyTitle = req.body.keyTitle 

    try{
        if(keyTitle !== ""){
            let resultUser = await User.find({uid: uid, email: email, "followStory.key": keyTitle})
            if(resultUser.length > 0){
                res.send({message: "Đã theo dõi", state: true})
            }else{
                res.send({message: "Theo dõi", state: false})
            }
        }else{
            console.log("checkStoryFollowStory", "keyTitle không được rỗng!")
            res.send({message: "Theo dõi", state: false})
        }
    }catch(err){
        console.log("checkStoryFollowStory", err)
        res.send({message: "Theo dõi", state: false})
    }
};

exports.saveFCMToken = async(req, res) => {
    let email = req.body.email ? req.body.email : ""
    let uid = req.body.uid ? req.body.uid : ""
    let fcmToken = req.body.fcmToken ? req.body.fcmToken : ""

    try{
        if(fcmToken !== ""){
            let ktAdd = await addFcmToken(uid, email, fcmToken)
            if(ktAdd){
                res.send({message: "Lưu fcmToken thành công!"})
            }else{
                res.send({message: "Lưu fcmToken thất bại!"})
            }
        }else{
            console.log("saveFCMToken", "Lưu fcmToken thất bại!")
            res.send({message: "Lưu fcmToken thất bại!"})
        }
    }catch(err){
        console.log("saveFCMToken", err)
        res.send({message: "Lưu fcmToken thất bại!"})
    }
};

exports.getDataFCMToken = async(req, res) => {
    let keyTitle = req.body.keyTitle 

    try{
        if(keyTitle !== ""){
            User.aggregate([
                { $match: { "followStory.key": keyTitle } },
                { $project : { fcmToken: 1, _id: 0 } },
                { $unwind : "$fcmToken" },
                { $project : { key: "$fcmToken.key" } },
                { $group : { 
                        _id: null,
                        fcmToken: {
                            $addToSet: "$key"
                        }
                    }
                }
            ])
            .then(result => {
                res.send(result)
            }).catch(err => {
                console.log("getDataFCMToken", "Lấy fcmToken thất bại!")
                res.send([])
            })
        }else{
            console.log("getDataFCMToken", "Lấy fcmToken thất bại!")
            res.send([])
        }
    }catch(err){
        console.log("getDataFCMToken", err)
        res.send([])
    }
};

exports.sortIndexViewFollowStory = async(req, res) => {
    let email = req.body.email ? req.body.email : ""
    let uid = req.body.uid ? req.body.uid : ""
    let keyTitle = req.body.keyTitle 

    try{
        if(keyTitle !== ""){
            let resultUser = await User.find({uid: uid, email: email, "followStory.key": keyTitle})
            if(resultUser.length > 0){
                let ktDelete = await deleteFollowStory(uid, email, keyTitle)
                if(ktDelete){
                    let ktAdd = await addFollowStory(uid, email, keyTitle)
                    if(ktAdd){
                        res.send({message: "Chỉnh sủa vị trí theo dõi truyện thành công!"})
                    }else{
                        res.send({message: "Chỉnh sủa vị trí theo dõi truyện thất bại!"})
                    }
                }else{
                    res.send({message: "Chỉnh sủa vị trí theo dõi truyện thất bại!"})
                }
            }else{
                res.send({message: "Chỉnh sủa vị trí theo dõi truyện thất bại!"})
            }
        }else{
            console.log("sortIndexViewFollowStory", "Chỉnh sủa vị trí theo dõi truyện thất bại!")
            res.send({message: "Chỉnh sủa vị trí theo dõi truyện thất bại!"})
        }
    }catch(err){
        console.log("sortIndexViewFollowStory", err)
        res.send({message: "Chỉnh sủa vị trí theo dõi truyện thất bại!"})
    }
};

exports.addFollowStory = async(req, res) => {
    let email = req.body.email ? req.body.email : ""
    let uid = req.body.uid ? req.body.uid : ""
    let keyTitle = req.body.keyTitle 

    try{
        if(keyTitle !== ""){
            let resultUser = await User.find({uid: uid, email: email, "followStory.key": keyTitle})
            if(resultUser.length > 0){
                let ktDelete = await deleteFollowStory(uid, email, keyTitle)
                if(ktDelete){
                    let ktAdd = await addFollowStory(uid, email, keyTitle)
                    if(ktAdd){
                        res.send({message: "Bạn theo dõi thành công!"})
                    }else{
                        res.send({message: "Bạn theo dõi thất bại!"})
                    }
                }else{
                    res.send({message: "Bạn theo dõi thất bại!"})
                }
            }else{
                let ktAdd = await addFollowStory(uid, email, keyTitle)
                if(ktAdd){
                    res.send({message: "Bạn theo dõi thành công!"})
                }else{
                    res.send({message: "Bạn theo dõi thất bại!"})
                }
            }
        }else{
            console.log("addFollowStory", "Bạn theo dõi thất bại!")
            res.send({message: "Bạn theo dõi thất bại!"})
        }
    }catch(err){
        console.log("addFollowStory", err)
        res.send({message: "Bạn theo dõi thất bại!"})
    }
};

exports.deleteFollowStory = async(req, res) => {
    let email = req.body.email ? req.body.email : ""
    let uid = req.body.uid ? req.body.uid : ""
    let keyTitle = req.body.keyTitle 

    try{
        if(keyTitle !== ""){
            let resultUser = await User.find({uid: uid, email: email, "followStory.key": keyTitle})
            if(resultUser.length > 0){
                let ktDelete = await deleteFollowStory(uid, email, keyTitle)
                if(ktDelete){
                    res.send({message: "Huỷ theo dõi thành oông!"})
                }else{
                    res.send({message: "Huỷ theo dõi thất bại!"})
                }
            }else{
                res.send({message: "Huỷ theo dõi thành oông!"})
            }
        }else{
            console.log("deleteFollowStory", "Huỷ theo dõi thất bại!")
            res.send({message: "Huỷ theo dõi thất bại!"})
        }
    }catch(err){
        console.log("deleteFollowStory", err)
        res.send({message: "Huỷ theo dõi thất bại!"})
    }
};

async function deleteFollowStory(uid, email, keyTitle){
    try{
        let result = await User.findOneAndUpdate(
            {
                uid: uid, 
                email: email
            }, 
            {
                $pull: 
                {
                    followStory:
                    {
                        key: keyTitle
                    }
                }
            },
            {new: true}
        )

        if(result !== null){
            return true
        }
        console.log("deleteFollowStory", "lỗi xoá story follow")
        return false
    }catch(err){
        console.log("deleteFollowStory", err)
        return false
    }
}

async function addFollowStory(uid, email, keyTitle){
    try{
        let result = await User.findOneAndUpdate(
            {
                uid: uid, 
                email: email
            }, 
            {
                $push: 
                {
                    followStory:
                    {
                        $each: 
                        [
                            {
                                key: keyTitle,
                                updatedAt: new Date()
                            }
                        ],
                        $sort: { updatedAt: -1 }
                    }
                }
            },
            {new: true}
        )

        if(result !== null){
            return true
        }

        console.log("addFollowStory", "lỗi thêm story follow")
        return false
    }catch(err){
        console.log("addFollowStory", err)
        return false
    }
}

async function addFcmToken(uid, email, fcmToken){
    try{
        let result = await User.findOneAndUpdate(
            {
                uid: uid, 
                email: email
            }, 
            {
                $push: 
                {
                    fcmToken:
                    {
                        $each: 
                        [
                            {
                                key: fcmToken,
                            }
                        ]
                    }
                }
            },
            {new: true}
        )

        if(result !== null){
            return true
        }
        console.log("addFcmToken", "lỗi thêm fcmToken")
        return false
    }catch(err){
        console.log("addFcmToken", err)
        return false
    }
}