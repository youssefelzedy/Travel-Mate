const Journey = require(`${__dirname}/../models/Journey`);
const User = require(`${__dirname}/../models/User`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const e = require("express");
const microbus = require(`${__dirname}/../utils/microBus`);
const TaxiLine = require(`${__dirname}/../utils/taxi`); // Renamed import for clarity

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
  const location = {
    lat: req.body.location?.lat,
    lng: req.body.location?.lng,
  };
  const destination = {
    lat: req.body.destination?.lat,
    lng: req.body.destination?.lng,
  };

  const transport = res.locals.transport || "microbus";
  const date = Date.now();

  console.log("Creating journey with:", { location, destination, transport });

  const journey = await Journey.create({
    location,
    destination,
    transport,
    date,
  });

  if (!journey) {
    return next(
      new AppError(
        {
          english: "Unable to create journey",
          arabic: "فشل انشاء المسار",
        },
        404
      )
    );
  }

  res.status(201).json({
    status: "success",
    message: {
      english: "Journey created successfully",
      arabic: "تم انشاء المسار بنجاح",
    },
    data: {
      journey,
      pathResult: res.locals.pathResult,
    },
  });
});

exports.updateJourney = catchAsync(async (req, res, next) => {
  const location = {
    lat: req.body.location?.lat,
    lng: req.body.location?.lng,
  };
  const destination = {
    lat: req.body.destination?.lat,
    lng: req.body.destination?.lng,
  };

  const journey = await Journey.findByIdAndUpdate(
    req.params.id,
    {
      location,
      destination,
      transport: req.body.transport,
      date: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // check if the journey is exist or not
  if (!journey) {
    return next(
      new AppError(
        "No journey found with that ID", // Pass a string directly
        404
      )
    );
  }
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
    return next(new AppError("No journey found with that ID", 404));
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
  const location_lat = req.body.location.lat;
  const location_lng = req.body.location.lng;
  const destination_lat = req.body.destination.lat;
  const destination_lng = req.body.destination.lng;

  // Validate input coordinates
  if (typeof location_lat !== 'number' || typeof location_lng !== 'number' ||
    typeof destination_lat !== 'number' || typeof destination_lng !== 'number') {
    return next(new AppError({
      english: "Invalid or missing coordinates provided.",
      arabic: "إحداثيات غير صالحة أو مفقودة.",
    }, 400));
  }
  const location = { lat: location_lat, lng: location_lng };
  const destination = { lat: destination_lat, lng: destination_lng };
  const coreMicrobus = new microbus(location, destination);


  coreMicrobus.initializeData()
    .then(() => {
      res.locals.pathResult = coreMicrobus.finalResult;
      console.log("PATH:", coreMicrobus.finalResult);
      next();
    })
    .catch((err) => {
      next(new AppError({
        english: `Microbus search failed: ${err.message}`,
        arabic: `فشل البحث عن ميكروباص: ${err.message}`,
      }, 400));

    });


});

exports.searchTaxi = catchAsync(async (req, res, next) => {
  const location_lat = req.body.location?.lat;
  const location_lng = req.body.location?.lng; // Assuming lng is longitude
  const destination_lat = req.body.destination?.lat;
  const destination_lng = req.body.destination?.lng; // Assuming lng is longitude

  // Validate input coordinates
  if (typeof location_lat !== 'number' || typeof location_lng !== 'number' ||
    typeof destination_lat !== 'number' || typeof destination_lng !== 'number') {
    return next(new AppError({
      english: "Invalid or missing coordinates provided.",
      arabic: "إحداثيات غير صالحة أو مفقودة.",
    }, 400));
  }

  const location = { lat: location_lat, lon: location_lng };
  const destination = { lat: destination_lat, lon: destination_lng };

  let coreTaxi;
  try {
    coreTaxi = new TaxiLine(location, destination);
  } catch (err) {
    // Catch constructor errors (e.g., invalid lat/lon types)
    return next(new AppError({
      english: `Failed to initialize taxi route: ${err.message}`,
      arabic: `فشل تهيئة مسار التاكسي: ${err.message}`,
    }, 400));
  }

  // Calculate the route
  const routeData = await coreTaxi.calculateRoute(); // No options needed, defaults are fine

  if (!routeData) {
    return next(new AppError({
      english: "Could not calculate a taxi route for the given locations.",
      arabic: "لم يتم العثور على مسار تاكسي للمواقع المحددة.",
    }, 404)); // 404 might be more appropriate if no route exists
  }

  // Get relevant data using the class methods
  const distance = coreTaxi.getDistance();
  const duration = coreTaxi.getDuration();
  const geometry = coreTaxi.getGeometry(); // GeoJSON LineString object or null
  const intersectionData = coreTaxi.getIntersectingNeighborhoods(); // { count, names } or null
  const price = coreTaxi.getRoutePrice();

  // Prepare the result object
  const result = {
    distance_meters: distance,
    duration_seconds: duration,
    price_egp: price,
    route_geometry: geometry, // Includes coordinates: geometry.coordinates
    intersecting_neighborhoods: intersectionData || { count: 0, names: [] }, // Provide default if null
  };

  // Store result for potential use in createJourney middleware
  res.locals.pathResult = result;
  res.locals.transport = 'taxi'; // Set transport type

  // Send response immediately or call next() if createJourney follows
  // Option 1: Send response directly
  res.status(200).json({
    status: "success",
    message: { // Changed from 'massage'
      english: "Taxi search completed successfully",
      arabic: "تم البحث عن تاكسي بنجاح",
    },
    data: {
      result: result,
    },
  });

  // Option 2: Call next() to proceed to createJourney (if it's chained)
  // next();
});
