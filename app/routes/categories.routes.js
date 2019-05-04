module.exports = (app) => {
    const categories = require('../controllers/categories.controller');
    
    // Lấy tất cả thể loại của story
    app.post('/v1/mobile/stories/category', categories.findAllCategory);

}