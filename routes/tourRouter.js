const express = require("express");
const tourController = require("./../controllers/tourControllers");
const authControllers = require("./../controllers/authController");
const reviewController = require("./../controllers/reviewController");
const reviewRouter = require("./reviewRouter");
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});
const router = express.Router();
// router.param("id", tourController.checkID);
router.use("/:tourId/reviews", reviewRouter);
router.route("/top-5-cheap").get(tourController.aliasTopTours);
router.route("/tour-stats").get(tourController.getTourStats);
router
  .route("/monthly-plan/:year")
  .get(authControllers.protect, tourController.getMonthlyPlan);
router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authControllers.protect,
    authControllers.restrictTo("admin, lead-guide"),
    tourController.createTour
  );
router.route("/distances/:latlng/unit/:units").get(tourController.getDistances);
router
  .route("/tours-within/:distance/center/:latlng/unit/:units")
  .get(tourController.getToursWithin);
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    authControllers.protect,
    authControllers.restrictTo("admin, lead-guide"),
    authControllers.protect,
    tourController.updateTour
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );
// router
//   .route("/:tourId/reviews")
//   .post(
//     authControllers.protect,
//     authControllers.restrictTo("user"),
//     reviewController.createReview
//   );

module.exports = router;
