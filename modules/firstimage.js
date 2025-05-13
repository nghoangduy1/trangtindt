function firstImage(noiDung) {
	// Biểu thức chính quy để tìm tất cả các thẻ <img> và lấy src của chúng
	var regExp = /<img[^>]+src="?([^"\s]+)"?[^>]*\/?>/g;
	var results = regExp.exec(noiDung);
	
	// Đặt ảnh mặc định nếu không tìm thấy ảnh trong bài viết
	var image = 'https://trangtin-7xcj.onrender.com/images/noimage.png';
	
	// Nếu có kết quả, trả về URL của ảnh đầu tiên
	if (results && results[1]) {
			image = results[1];
	}
	
	return image;
}

module.exports = firstImage;
