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
} = require("../controller/bootcamps");



router
    .route("/")
    .get(getBootcamps)
    .post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);


  router.route('/radius/:zipcode/:distance').get(radiusSearch)
  router.use('/:bootcampId/courses',coursesRouter)

module.exports = router;
