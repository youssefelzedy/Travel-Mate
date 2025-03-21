const Journey = require(`${__dirname}/../models/Journey`);
const User = require(`${__dirname}/../models/User`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const e = require("express");
const microbus = require(`${__dirname}/../utils/microBus`);
const taxi = require(`${__dirname}/../utils/taxi`);

exports.getAllJourneys = catchAsync(async (req, res, next) => {
  const journeys = await Journey.find();
  res.status(200).json({
    status: "success",
    massage: {
      english: "Journeys retrieved successfully",
      arabic: "تم تحميل المسارات بنجاح",
    },
    results: journeys.length,
    data: {
      journeys,
    },
  });
});

exports.getJourney = catchAsync(async (req, res, next) => {
  const journey = await Journey.findById(req.params.id);
  res.status(200).json({
    status: "success",
    massage: {
      english: "Journey retrieved successfully",
      arabic: "تم تحميل المسار بنجاح",
    },
    data: {
      journey,
    },
  });
});

exports.createJourney = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  // chcek if user has already exist or not
  if (!user) {
    return next(
      new AppError(
        "You have already not created, you can't create any journeys",
        400
      )
    );
  }

  // create the journey
  const journey = await Journey.create({
    location: req.body.location,
    destination: req.body.destination,
    user: user._id,
    transport: req.body.transport,
    date: req.body.date,
  });

  // push the journey to the user
  user.journeys.push(journey._id);
  await user.save();


  res.status(201).json({
    status: "success",
    massage: {
      english: "Journey created successfully",
      arabic: "تم انشاء المسار بنجاح",
    },
    data: {
      journey,
    },
  });
});

exports.updateJourney = catchAsync(async (req, res, next) => {
  const journey = await Journey.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    massage: {
      english: "Journey updated successfully",
      arabic: "تم تحديث المسار بنجاح",
    },
    data: {
      journey,
    },
  });
});

exports.deleteJourney = catchAsync(async (req, res, next) => {
  await Journey.findByIdAndDelete(req.params.id);

  // check if the journey is exist or not
  if (!journey) {
    return next(new AppError("No journey found with that ID",
      404));
  }

  // delete the journey from the user
  const user = await User.findById(req.user.id);
  user.journeys.splice(user.journeys.indexOf(req.params.id), 1);
  await user.save();


  res.status(204).json({
    status: "success",
    massage: {
      english: "Journey deleted successfully",
      arabic: "تم حذف المسار بنجاح",
    },
    data: null,
  });
});

exports.searchMicrobus = catchAsync(async (req, res, next) => {
  try {
    const location_lat = req.body.location.lat;
    const location_lng = req.body.location.lng;
    const destination_lat = req.body.destination.lat;
    const destination_lng = req.body.destination.lng;

    const location = { lat: location_lat, lng: location_lng };
    const destination = { lat: destination_lat, lng: destination_lng };

    const coreMicrobus = new microbus(location, destination);
    coreMicrobus.initializeData().then(() => {
      res.status(200).json({
        status: "success",
        massage: {
          english: "Microbus search completed successfully",
          arabic: "تم البحث عن الميكروباص بنجاح",
        },
        data: {
          result: coreMicrobus.finalResult,
        },
      });
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      massage: {
        english: "Microbus search failed",
        arabic: "فشل البحث عن الميكروباص",
      },
      data: {
        err,
      },
    });
  }
});

exports.searchTaxi = catchAsync(async (req, res, next) => {
  try {
    const location_lat = req.body.location.lat;
    const location_lng = req.body.location.lng;
    const destination_lat = req.body.destination.lat;
    const destination_lng = req.body.destination.lng;

    const location = { lat: location_lat, lng: location_lng };
    const destination = { lat: destination_lat, lng: destination_lng };

    const coreTaxi = new taxi(location, destination);
    coreTaxi.initialize().then(() => {
      res.status(200).json({
        status: "success",
        massage: {
          english: "Taxi search completed successfully",
          arabic: "تم البحث عن تاكسي بنجاح",
        },
        data: {
          result: coreTaxi.finalResult,
        },
      });
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      massage: {
        english: "Taxi search failed",
        arabic: "فشل البحث عن تاكسي",
      },
      data: {
        err,
      },
    });
  }
});
