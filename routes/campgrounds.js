const express = require('express');
const router = express.Router();
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary/index.js');
const upload = multer({ storage });
//all campgrounds routes are here:


router.route('/')
    .get((campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, campgrounds.createCampground)

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(campgrounds.showCampground)
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, campgrounds.updateCampground)
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground);

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm);


module.exports = router;



