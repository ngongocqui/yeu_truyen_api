module.exports = (app) => {
    const user = require('../controllers/user.controller');
    
    // Tạo 1 user khi login bằng facebook hay google
    app.post('/v1/mobile/user/loginwithauth', user.loginWithAuth);

    // Thêm truyện mà người dùng theo dõi
    app.post('/v1/mobile/user/storyfollow/add', user.addFollowStory);

    // Xoá truyện mà người dùng theo dõi
    app.post('/v1/mobile/user/storyfollow/delete', user.deleteFollowStory);

    // Lấy truyện mà người dùng theo dõi
    app.post('/v1/mobile/user/storyfollow', user.getDataFollowStory);

    // Kiểm tra truyện có nằm trong truyện mà người dùng đó theo dõi
    app.post('/v1/mobile/user/storyfollow/check', user.checkStoryFollowStory);

    // Sắp xếp vị trí xem truyện mà người dùng theo dõi
    app.post('/v1/mobile/user/storyfollow/index', user.sortIndexViewFollowStory);

    // Save firebase cloud message token
    app.post('/v1/mobile/user/fcm/savefcmtoken', user.saveFCMToken);

    // Get all firebase cloud message token của 1 truyện mà người dùng theo dõi
    app.post('/v1/mobile/user/fcm/storyfollow', user.getDataFCMToken);
}