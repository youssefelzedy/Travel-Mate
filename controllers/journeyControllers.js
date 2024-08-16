const Journey = require("../models/Journey");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");


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

