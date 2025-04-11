const journeyControllers = require(`${__dirname}/../controllers/journeyControllers`);
const authControllers = require(`${__dirname}/../controllers/authControllers`);
const express = require("express");
const router = express.Router();

router
  .route("/")
  .get(journeyControllers.getAllJourneys);
router
  .route("/:id")
  .get(journeyControllers.getJourney)
  .patch(journeyControllers.updateJourney)
  .delete(
    journeyControllers.deleteJourney
  );

router
  .route("/search-microbus")
  .post(journeyControllers.searchMicrobus, journeyControllers.createJourney);

router.route("/search-taxi").post(journeyControllers.searchTaxi);

module.exports = router;
