const mongoose = require('mongoose');

const binhLuanSchema = new mongoose.Schema({
	name: String, // Tên người bình luận
	content: String, // Nội dung bình luận
	createdAt: {
		type: Date,
		default: Date.now
	},
	baiviet: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BaiViet' // Giả sử bạn có model BaiViet
	}
});

module.exports = mongoose.model('BinhLuan', binhLuanSchema);