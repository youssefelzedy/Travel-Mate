const journeyControllers = require("../controllers/journeyControllers");
const authControllers = require("../controllers/authControllers");
const express = require("express");
const router = express.Router();


router
    .route("/")
    .get(authControllers.protect,authControllers.restrictTo("admin"),journeyControllers.getAllJourneys)
    .post(authControllers.protect,journeyControllers.createJourney);
router  
    .route("/:id")
    .get(authControllers.protect,journeyControllers.getJourney)
    .patch(authControllers.protect,authControllers.restrictTo("admin"),journeyControllers.updateJourney)
    .delete(authControllers.protect,authControllers.restrictTo("admin"),journeyControllers.deleteJourney);

router.route("/search-microbus").post(journeyControllers.searchMicrobus);
router.route("/search-taxi").post(journeyControllers.searchTaxi);

module.exports = router