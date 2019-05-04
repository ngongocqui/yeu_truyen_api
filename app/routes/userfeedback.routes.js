module.exports = (app) => {
    const userfeedback = require('../controllers/userfeedback.controller');

    // gửi tin nhắn phải hồi của người dùng lên gmail
    app.post('/v1/mobile/send/userfeedback', userfeedback.sendMessageMailAdmin);
}