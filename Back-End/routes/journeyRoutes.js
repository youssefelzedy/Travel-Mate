const journeyControllers = require(`${__dirname}/../controllers/journeyControllers`);
const authControllers = require(`${__dirname}/../controllers/authControllers`);
const express = require("express");
const router = express.Router();


router
    .route("/")
    .get(authControllers.restrictTo("admin"),journeyControllers.getAllJourneys)
    .post(journeyControllers.createJourney);
router  
    .route("/:id")
    .get(journeyControllers.getJourney)
    .patch(authControllers.restrictTo("admin"),journeyControllers.updateJourney)
    .delete(authControllers.restrictTo("admin"),journeyControllers.deleteJourney);

router.route("/search-microbus").post(journeyControllers.searchMicrobus);
router.route("/search-taxi").post(journeyControllers.searchTaxi);

module.exports = router