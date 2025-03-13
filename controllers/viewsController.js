const Tours = require("./../models/toursModel");
const catchAsync = require("./../utilities/catchAsync");
const AppError = require("./../utilities/appError");
const User = require("./../models/userModel");
const Booking = require("./../models/bookingModel");

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tours.find();
  res.status(200).render("overview", { title: "All Tours", tours });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tours.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    select: "user review rating",
  });
  if (!tour) {
    return next(new AppError("There is no tour with that name", 404));
  }

  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});
exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Login to Your Account",
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your Account",
    user: res.locals.user,
  });
};
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true }
  );
  res.status(200).render("account", {
    title: "Your Account",
    user: updatedUser,
  });
});
exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourID = bookings.map((el) => el.tour);
  const tours = await Tours.find({ _id: tourID });

  res.status(200).render("overview", { title: "My Tours", tours });
});
