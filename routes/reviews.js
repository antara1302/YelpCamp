const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, validateReviews, isReviewAuthor } = require('../middleware.js');
const reviews = require('../controllers/reviews.js');

//review route for each campground:
router.post('', validateReviews, isLoggedIn, reviews.createReview);

//delete review route:
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviews.deleteReview);

module.exports = router;