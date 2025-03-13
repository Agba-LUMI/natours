const axios = require("axios");
const Tour = require("../models/toursModel");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");
const dotenv = require("dotenv");
const Booking = require("./../models/bookingModel");
const factory = require("./handlerFactory");

dotenv.config({ path: "./config.env" });

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  try {
    // Initialize payment
    const tour = await Tour.findById(req.params.tourID);
    if (!tour) {
      return next(new AppError("No tour found with that ID", 404));
    }

    const amountInKobo = tour.price * 100;
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: req.user.email,
        amount: amountInKobo,
        currency: "NGN",
        reference: `tx_${req.user.id}_${Date.now()}`,
        callback_url: `${req.protocol}://${req.get("host")}/?tour=${req.params.tourID}&user=${req.user.id}&price=${tour.price}`,
        metadata: {
          tourId: tour.id,
          userId: req.user.id,
          tourName: tour.name,
          description: tour.summary,
          image: `https://www.natours.dev/img/tours/${tour.imageCover}`,
          amount: amountInKobo,
          client_reference_id: req.params.tourId,
          cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(req.query);

    return res.status(200).json({
      status: "success",
      user: req.user,
      data: { ...response.data.data, amount: amountInKobo / 100 },
    });
  } catch (error) {
    console.error("Paystack Error:", error.response?.data || error.message);
    return res.status(500).json({
      status: "error",
      message: error.response?.data?.message || "Payment process failed",
    });
  }
});
exports.createBookingCheckOut = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split("?")[0]);
});
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
