const express = require("express");
const { getCourses,getCourse,addCourse, updateCourse, deleteCoures } = require("../controller/courses");
const Course= require('../model/Course')
const advanceResults= require('../middleware/advanceResults');
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({mergeParams:true});
router.route('/')
.get(
  advanceResults(Course, {
    path: 'bootcamp',
    select: 'name description'
  }),
  getCourses
).post(protect,authorize('publisher','admin'),addCourse)
    
router.route('/:id').get(getCourse).put(protect,authorize('publisher','admin'),updateCourse).delete(protect,authorize('publish','admin'),deleteCoures)

module.exports = router;
