const Journey = require("../models/Journey");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const e = require("express");
const microbus = require("../utils/microbus");
const taxi = require("../utils/taxi");


exports.getAllJourneys = catchAsync(async (req, res, next) => {
    const journeys = await Journey.find();
    res.status(200).json({
        status: "success",
        massage: {
            english: "Journeys retrieved successfully",
            arabic: "تم تحميل المسارات بنجاح"
        },
        results: journeys.length,
        data: {
            journeys
        }
    });
})


exports.getJourney = catchAsync(async (req, res, next) => {
    const journey = await Journey.findById(req.params.id);
    res.status(200).json({
        status: "success",
        massage: {
            english: "Journey retrieved successfully",
            arabic: "تم تحميل المسار بنجاح"
        },
        data: {
            journey
        }
    });
})


exports.createJourney = catchAsync(async (req, res, next) => {
    const journey = await Journey.create({
        city: req.body.city,
        transport: req.body.transport,
        location: req.body.location
      });

    const user = await User.findById(req.user.id);
    user.journeys.push(journey._id);
    await user.save();


    res.status(201).json({
        status: "success",
        massage: {
            english: "Journey created successfully",
            arabic: "تم انشاء المسار بنجاح"
        },
        data: {
            journey
        }
    });
})

exports.updateJourney = catchAsync(async (req, res, next) => {  
    const journey = await Journey.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }); 
    res.status(200).json({
        status: "success",
        massage: {
            english: "Journey updated successfully",
            arabic: "تم تحديث المسار بنجاح"
        },
        data: {
            journey
        }
    });
})


exports.deleteJourney = catchAsync(async (req, res, next) => {
    await Journey.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: "success",
        massage: {
            english: "Journey deleted successfully",
            arabic: "تم حذف المسار بنجاح"
        },
        data: null
    });
})

exports.searchMicrobus = catchAsync(async (req, res, next) => {
    try {
        const location_lat = req.body.location.lat;
        const location_lng = req.body.location.lng;
        const destination_lat = req.body.destination.lat;
        const destination_lng = req.body.destination.lng;
    
        const location = { lat: location_lat, lng: location_lng };
        const destination = { lat: destination_lat, lng: destination_lng };

        console.log(location);
        console.log(destination);
    
        const coreMicrobus = new microbus(location, destination);
        coreMicrobus.initializeData().then(() => {
            res.status(200).json({
                status: "success",
                massage: {
                    english: "Microbus search completed successfully",
                    arabic: "تم البحث عن الميكروباص بنجاح"
                },
                data: {
                    result: coreMicrobus.finalResult
                }
            });
        });
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            massage: {
                english: "Microbus search failed",
                arabic: "فشل البحث عن الميكروباص"
            },
            data: {
                err
            }
        });
    }
})

exports.searchTaxi = catchAsync(async (req, res, next) => {
    try {
        const location_lat = req.body.location.lat;
        const location_lng = req.body.location.lng;
        const destination_lat = req.body.destination.lat;
        const destination_lng = req.body.destination.lng;
    
        const location = { lat: location_lat, lng: location_lng };
        const destination = { lat: destination_lat, lng: destination_lng };

        console.log(location);
        console.log(destination);
    
        const coreTaxi = new taxi(location, destination);
        console.log(1)
        coreTaxi.initialize().then(() => {
            res.status(200).json({
                status: "success",
                massage: {
                    english: "Taxi search completed successfully",
                    arabic: "تم البحث عن تاكسي بنجاح"
                },
                data: {
                    result: coreTaxi.finalResult
                }
            });
        });
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            massage: {
                english: "Taxi search failed",
                arabic: "فشل البحث عن تاكسي"
            },
            data: {
                err
            }
        });
    }
})