const factory = require("./handlerFactory");
const Review = require("./../models/reviewModel");
const catchAsync = require("./../utilities/catchAsync");
const Booking = require("./../models/bookingModel");
const Tour = require("./../models/toursModel");
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createReview = factory.createOne(Review);
exports.setReviewFilter = (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  next();
};
exports.getAllReviews = factory.getAll(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
