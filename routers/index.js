var express = require('express');
var router = express.Router();
var firstImage = require('../modules/firstimage');
var ChuDe = require('../models/chude');
var BaiViet = require('../models/baiviet');
var striptags = require('striptags');

// GET: Trang chủ
router.get('/', async (req, res) => {
	var cm = await ChuDe.find();

    var bv = await BaiViet.find({ KiemDuyet: 1 })
        .sort({ NgayDang: -1 })
        .populate('ChuDe')
        .populate('TaiKhoan')
        .exec();

    var xnn = await BaiViet.find({ KiemDuyet: 1 })
        .sort({ LuotXem: -1 })
        .populate('ChuDe')
        .populate('TaiKhoan')
        .limit(3).exec();

    res.render('index', {
        title: 'Trang chủ',
        chuyenmuc: cm,
        baiviet: bv,
        xemnhieunhat: xnn,
        firstImage: firstImage
    });
});

// GET: Lấy các bài viết cùng mã chủ đề
router.get('/baiviet/chude/:id', async (req, res) => {
	var id = req.params.id;

    var cm = await ChuDe.find();
    var cd = await ChuDe.findById(id);

    var bv = await BaiViet.find({ KiemDuyet: 1, ChuDe: id })
        .sort({ NgayDang: -1 })
        .populate('ChuDe')
        .populate('TaiKhoan')
        .exec();

    // Lấy 3 bài viết xem nhiều nhất hiển thị vào cột phải
    var xnn = await BaiViet.find({ KiemDuyet: 1, ChuDe: id })
        .sort({ LuotXem: -1 })
        .populate('ChuDe')
        .populate('TaiKhoan')
        .limit(3).exec();

    res.render('baiviet_chude', {
        title: 'Bài viết cùng chuyên mục',
        chuyenmuc: cm,
        chude: cd,
        baiviet: bv,
        xemnhieunhat: xnn,
        firstImage: firstImage
    });
});

// GET: Xem bài viết
router.get('/baiviet/chitiet/:id', async (req, res) => {
	var id = req.params.id;

  // Lấy chuyên mục hiển thị vào menu
  var cm = await ChuDe.find();

  // Lấy thông tin bài viết hiện tại
  var bv = await BaiViet.findById(id)
    .populate('ChuDe')
    .populate('TaiKhoan').exec();

  // Xử lý tăng lượt xem bài viết
		if(req.session.DaXem != id){
		await BaiViet.findByIdAndUpdate(id, {
			LuotXem: bv.LuotXem + 1
		 });
		 req.session.DaXem = id;
		}
  // Lấy 3 bài viết xem nhiều nhất hiển thị vào cột phải
  var xnn = await BaiViet.find({ KiemDuyet: 1 })
    .sort({ LuotXem: -1 })
    .populate('ChuDe')
    .populate('TaiKhoan')
    .limit(3).exec();

  res.render('baiviet_chitiet', {
    chuyenmuc: cm,
    baiviet: bv,
    xemnhieunhat: xnn,
    firstImage: firstImage
  });
});

// GET: Tin mới nhất
router.get('/tinmoi', async (req, res) => {
	res.render('tinmoinhat', {
		title: 'Tin mới nhất'
	});
});

// POST: Kết quả tìm kiếm
router.post('/timkiem', async (req, res) => {
  var tukhoa = req.body.tukhoa;

  if (!tukhoa) {
    const cm = await ChuDe.find();
    return res.render('timkiem', {
      title: 'Kết quả tìm kiếm',
      baiviet: [],
      tukhoa: 'Vui lòng nhập từ khóa tìm kiếm.',
      chuyenmuc: cm,
      firstImage: require('../modules/firstimage') // ✅ thêm dòng này
    });
  }

  try {
    const cm = await ChuDe.find();
    const bv = await BaiViet.find({
      KiemDuyet: 1,
      $or: [
        { TieuDe: { $regex: tukhoa, $options: 'i' } },
        { NoiDung: { $regex: tukhoa, $options: 'i' } }
      ]
    })
      .sort({ NgayDang: -1 })
      .populate('ChuDe')
      .populate('TaiKhoan')
      .exec();

    const cleanContent = bv.map(bai => {
      return {
        ...bai._doc,
        MoTa: striptags(bai.NoiDung).substring(0, 150)
      };
    });

    res.render('timkiem', {
      title: 'Kết quả tìm kiếm',
      baiviet: cleanContent,
      tukhoa: tukhoa,
      chuyenmuc: cm,
      firstImage: require('../modules/firstimage') // ✅ thêm dòng này
    });

  } catch (error) {
    const cm = await ChuDe.find();
    res.render('timkiem', {
      title: 'Kết quả tìm kiếm',
      baiviet: [],
      tukhoa: 'Có lỗi xảy ra khi tìm kiếm.',
      chuyenmuc: cm,
      firstImage: require('../modules/firstimage') // ✅ thêm dòng này
    });
  }
});

// GET: Lỗi
router.get('/error', async (req, res) => {
	res.render('error', {
		title: 'Lỗi'
	});
});

// GET: Thành công
router.get('/success', async (req, res) => {
	res.render('success', {
		title: 'Hoàn thành'
	});
});

//Thời tiết
router.get('/weather', async function(req, res) {
  const chuyenmuc = await ChuDe.find();
  const xemnhieunhat = await BaiViet.find({ KiemDuyet: 1 }).sort({ LuotXem: -1 }).limit(3).populate('ChuDe').exec();

  res.render('weather', {
    title: 'Thời tiết',
    chuyenmuc: chuyenmuc,
    xemnhieunhat: xemnhieunhat,
    firstImage: firstImage
  });
});

module.exports = router;