const express = require("express");
const coursesRouter = require("./courses");
const reviewRouter = require("./review");

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
const {protect, authorize}= require('../middleware/auth')
router
    .route("/")
    .get(advanceResults(Bootcamp,'courses'),getBootcamps)
    .post(protect,authorize('publisher','admin'),createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect,authorize('publisher','admin'),updateBootcamp)
  .delete(protect,authorize('publisher','admin'),deleteBootcamp);


  router.route('/radius/:zipcode/:distance').get(radiusSearch)
  router.use('/:bootcampId/courses',coursesRouter)
  router.use('/:bootcampId/reviews',reviewRouter)

  router
  .route('/:id/photo')
  .put(protect,authorize('publisher','admin'),bootcampPhotoUpdate);

module.exports = router;
