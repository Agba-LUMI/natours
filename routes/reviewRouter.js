const reviewController = require("./../controllers/reviewController");
const express = require("express");
const authController = require("./../controllers/authController");
const router = express.Router({ mergeParams: true });
// router.use(authController.protect);
router
  .route("/")
  .get(reviewController.setReviewFilter, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );
router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo("admin", "user"),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo("admin", "user"),
    reviewController.updateReview
  );

module.exports = router;
