const placeControllers = require(`${__dirname}/../controllers/placeControllers`);
const authControllers = require(`${__dirname}/../controllers/authControllers`);
const express = require("express");
const router = express.Router();


router
    .route("/")
    .get(placeControllers.getAllPlaces)
    .post(placeControllers.createPlace);
router  
    .route("/:city")
    .get(placeControllers.getPlace)
    .patch(placeControllers.updatePlace)
    .delete(placeControllers.deletePlace);

module.exports = router