const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    reviews: {
      type: String,
      required: [true, "Reviews cannot be empty"],
    },
    averageRatings: {
      type: Number,
      min: 1,
      max: 5,
      set: (val) => Math.round(val * 10) / 10,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Rreview must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name photo",
  });
});
reviewSchema.statics.calAverageRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$ratings" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsQuantity: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsQuantity: 4.5,
    });
  }
};
reviewSchema.post("save", function () {
  this.constructor.calAverageRating(this.tour);
});
reviewSchema.pre(/^findOne/, async function () {
  this.r = await this.findOne();
  next();
});
reviewSchema.post(/^findOne/, async function () {
  await this.r.constructor.calAverageRating(this.r.tour);
});
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
