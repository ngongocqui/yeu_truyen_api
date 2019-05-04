module.exports = (app) => {
    const stories = require('../controllers/stories.controller');

    // // Lấy chiều dài danh sách tập truyện trong một truyện theo key
    // app.post('/v1/mobile/stories/episodes/length', stories.getLengthEpisodesStory);

    // Lấy danh sách tập truyện trong một truyện theo key
    app.get('/v1/mobile/stories/episodes', stories.findEpisodesStory);

    // // Lấy danh sách tập truyện có giới hạn trong một truyện theo key
    // app.post('/v1/mobile/stories/episodes', stories.findEpisodesStoryLimit);

    // // Lấy đảo danh sách tập truyện có giới hạn trong một truyện theo key
    // app.post('/v1/mobile/stories/episodes/reverse', stories.findReverseEpisodesStoryLimit);

    // Lấy thông tin của một tập trong một truyện theo key
    app.get('/v1/mobile/stories/episodes/episodeskey', stories.findOneEpisodesStory);

    // Lấy thông tin của một bộ truyện theo key
    app.post('/v1/mobile/stories/storieskey', stories.findDetailStory);

    // Tìm kiếm theo từ khoá keySearch
    app.post('/v1/mobile/stories/keySearch/limit', stories.findAllStorySearchByKeyword);

    // Lấy tất cả story của tất cả các thể loại có sắp xếp (ngày cập nhật, lượt xem, số chuong)
    app.post('/v1/mobile/stories/category/limit', stories.findStorySort);

    // Lấy tất cả story của 1 hoặc nhiều thể loại có sắp xếp (ngày cập nhật, lượt xem, số chuong)
    app.post('/v1/mobile/stories/storiesfilter/limit', stories.findStoryFilterAndSort);

    // Lấy số trang story của tất cả các thể loại có sắp xếp (ngày cập nhật, lượt xem, số chuong)
    app.post('/v1/mobile/stories/category/limit/pagination', stories.findPaginationStorySort);

    // Lấy số trang story của 1 hoặc nhiều thể loại có sắp xếp (ngày cập nhật, lượt xem, số chuong)
    app.post('/v1/mobile/stories/storiesfilter/limit/pagination', stories.findPaginationStoryFilterAndSort);

    // Lấy tất cả story full của tất cả các thể loại có sắp xếp (ngày cập nhật, lượt xem, số chuong)
    app.post('/v1/mobile/storiesfull/category/limit', stories.findStoryFullSort);

    // Lấy tất cả story full của 1 hoặc nhiều thể loại có sắp xếp (ngày cập nhật, lượt xem, số chuong)
    app.post('/v1/mobile/storiesfull/storiesfilter/limit', stories.findStoryFullFilterAndSort);

    // Lấy số trang story full của tất cả các thể loại có sắp xếp (ngày cập nhật, lượt xem, số chuong)
    app.post('/v1/mobile/storiesfull/category/limit/pagination', stories.findPaginationStoryFullSort);

    // Lấy số trang story full của 1 hoặc nhiều thể loại có sắp xếp (ngày cập nhật, lượt xem, số chuong)
    app.post('/v1/mobile/storiesfull/storiesfilter/limit/pagination', stories.findPaginationStoryFullFilterAndSort);

    // lấy chiều dài episodes của story theo key
    app.post('/v1/mobile/stories/storieskey/episodes', stories.findEpisodesLength);

    // kiểm tra kết nối internet
    app.get('/v1/mobile/stories/connect', stories.connect);
}