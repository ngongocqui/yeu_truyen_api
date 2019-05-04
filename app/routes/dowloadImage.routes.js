module.exports = (app) => {
    const dowloadImage = require('../controllers/dowloadImage.controller');
    
    // tải hình ảnh về server
    app.post('/v1/mobile/image/dowload', dowloadImage.dowloadImage);

}