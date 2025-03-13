const mongoose = require("mongoose");
const slugify = require("slugify");
const validata = require("validator");
const User = require("./userModel");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "Name should not be less than or equal to 40 letters"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a max group"],
    },
    difficulty: {
      type: String,
      default: "Easy",
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    slug: String,
    rating: {
      type: Number,
      default: 4.5,
      required: true,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: "The discount price should be less than the regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "point",
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    location: [
      {
        type: {
          type: String,
          default: "point",
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array,

    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
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
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
// Virtual Populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});
tourSchema.index({ startLocation: "2dsphere" });
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// for populating
// Indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.pre(/^find/, function () {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangeAt",
  });
});
// Tour embedding
// tourSchema.pre("save", function () {
//   guidesPromise = this.guides.map(async (id) => {
//     await User.findById(id);
//     this.guides = await Promise.all(guidesPromise);
//   });

//   next();
// });
tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } });
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
