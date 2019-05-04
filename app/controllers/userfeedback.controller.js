const nodemailer = require("nodemailer");

exports.sendMessageMailAdmin = async(req, res) => {
    let content = req.body.content

    try{
        let kt = await sendMessageMailAdmin(content)
        if(kt){
            res.send({message: "Gửi phản hồi thành công!"})
        }else{
            res.send({message: "Gửi phản hồi thất bại!"})
        }
    }catch(err){
        res.send({message: "Gửi phản hồi thất bại!"})
        console.log(err)
    }
};

async function sendMessageMailAdmin(content){
    try{
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "userfeedback1995@gmail.com", 
                pass: "qui@1995" 
            }
        });
        
        let mailOptions = {
            from: '"Yêu Truyện" <feedback1995@gmail.com>', // sender address
            to: "tranphanchau10@gmail.com", // list of receivers
            subject: 'Phản hồi từ ứng dụng yêu truyện của bạn', // Subject line
            text: content, // plain text body
        };
    
        let response = await transporter.sendMail(mailOptions)
        if(response.messageId){
            return true
        }
    }catch(err){
        console.log(err)
    }

    return false
}