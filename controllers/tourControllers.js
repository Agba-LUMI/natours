const Tour = require("./../models/toursModel");
const catchAsync = require("./../utilities/catchAsync");
const AppError = require("./../utilities/appError");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (req.file.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image, Please upload an image", 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadTourImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 1 },
]);
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || req.files.images) return next();
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .toFile(`./public/img/tours/${req.body.imageCover}`);
  req.body.images = [];

  await promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .toFile(`./public/img/tours/${filename}`);
      req.body.images.push(filename);
    })
  );
  next();
});
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = factory.getAll(Tour);

exports.createTour = factory.createOne(Tour);

exports.getTour = factory.getOne(Tour, { path: "review" });
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTour: { $sum: 1 },
        ratingQuantity: { $sum: "$ratingsQuatity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $group: {
        _id: {
          $month: "$startDates",
        },
        numTourStarts: { $sum: 1 },
        tour: {
          $push: "$name",
        },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: plan.length,
    data: {
      plan,
    },
  });
});
// "/tours-within/:distance/center/:latlng/unit/:units",
// tourController.getToursWithin

// Geospatial Queries
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, units } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = units === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format: lat,lng",
        400
      )
    );
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      data: tours,
    },
  });
});
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, units } = req.params;
  const [lat, lng] = latlng.split(",");
  const multiplier = units === "mi" ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format: lat,lng",
        400
      )
    );
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      data: distances,
    },
  });
});
