const express = require("express");
const coursesRouter = require("./courses");

const router = express.Router();

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  radiusSearch,
  bootcampPhotoUpdate,
} = require("../controller/bootcamps");

const Bootcamp= require('../model/Bootcamp')
const advanceResults= require('../middleware/advanceResults')
router
    .route("/")
    .get(advanceResults(Bootcamp,'courses'),getBootcamps)
    .post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);


  router.route('/radius/:zipcode/:distance').get(radiusSearch)
  router.use('/:bootcampId/courses',coursesRouter)
  router
  .route('/:id/photo')
  .put(bootcampPhotoUpdate);

module.exports = router;
