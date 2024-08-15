const placeControllers = require("../controllers/placeControllers");
const authControllers = require("../controllers/authControllers");
const express = require("express");
const router = express.Router();


router
    .route("/")
    .get(authControllers.protect,placeControllers.getAllPlaces)
    .post(authControllers.protect,authControllers.restrictTo("admin"),placeControllers.createPlace);
router  
    .route("/:city")
    .get(authControllers.protect,placeControllers.getPlace)
    .patch(authControllers.protect,authControllers.restrictTo("admin"),placeControllers.updatePlace)
    .delete(authControllers.protect,authControllers.restrictTo("admin"),placeControllers.deletePlace);

module.exports = router