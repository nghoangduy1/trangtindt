const express = require('express');
const router = express.Router();
const BinhLuan = require('../models/binhluan');

// Route gửi bình luận
router.post('/:baivietId', async (req, res) => {
	const { name, content } = req.body;
	const { baivietId } = req.params;

	try {
		await BinhLuan.create({
			name,
			content,
			baiviet: baivietId
		});
		req.session.success = 'Bình luận đã được gửi!';
	} catch (err) {
		req.session.error = 'Gửi bình luận thất bại!';
	}

	res.redirect('/baiviet/' + baivietId);
});

module.exports = router;