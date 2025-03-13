const viewsController = require("./../controllers/viewsController");
const authController = require("./../controllers/authController");
const bookingController = require("./../controllers/bookingController");
const express = require("express");
const router = express.Router();

router.get(
  "/",
  bookingController.createBookingCheckOut,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour);
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
router.get("/me", authController.protect, viewsController.getAccount);
router.get("/my-tours", authController.protect, viewsController.getMyTours);
router.post(
  "/submit-user-data",
  authController.protect,
  viewsController.updateUserData
);
// router.get("/logout", authController.logout);
module.exports = router;
