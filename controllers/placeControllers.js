const express = require("express");
const Place = require("../models/Place");
const catchAsync = require("../utils/catchAsync");
const cities = require("../utils/cities");
const getPlacesInCity = require("../utils/getPlacesInCity");


exports.createPlace = catchAsync(async (req, res, next) => {
    const place = await Place.create(req.body);
    res.status(201).json({
        status: "success",
        massage: "Place created successfully",
        data: {
            place
        }
    });
})


exports.getAllPlaces = catchAsync(async (req, res, next) => {
    const places = cities.map(city => {
        return {
            city: city.name,
            arabicName: city.arabicName

        }
    })
    res.status(200).json({
        status: "success",
        results: places.length,
        data: {
            places
        }
    });
})



exports.getPlace = catchAsync(async (req, res, next) => {
    // Find the city by governorate name from request params
    const place = cities.find(city => city.name === req.params.city);    


    if (!place) {
        return next(new AppError({ english: "City not found", arabic: "المدينة غير موجودة" }, 404));
    }

    const places = await getPlacesInCity(place.location);

    res.status(200).json({
        status: "success",
        results: places.length,
        data: {
            places
        }
    });

});



exports.updatePlace = catchAsync(async (req, res, next) => {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: "success",
        data: {
            place
        }
    });
})


exports.deletePlace = catchAsync(async (req, res, next) => {
    await Place.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: "success",
        data: null
    });
})
