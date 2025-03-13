const bookingController = require("./../controllers/bookingController");
const express = require("express");
const authController = require("./../controllers/authController");
const router = express.Router();
router.use(authController.protect);

router.get(
  "/checkout-session/:tourID",

  bookingController.getCheckoutSession
);
router.use(authController.restrictTo("admin"));
router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);
router
  .route("/:id")
  .get(bookingController.getBooking)
  .delete(bookingController.deleteBooking)
  .patch(bookingController.updateBooking);
module.exports = router;
