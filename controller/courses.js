const Course = require('../model/Course')
const ErrorResponse= require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../model/Bootcamp');

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses=asyncHandler(async (req,res,next)=>{
    let query
    // console.log(req.params.bootcampId)
    if(req.params.bootcampId){
        query=Course.find({bootcamp:req.params.bootcampId}).populate('bootcamp')
    }
    else{
        query=Course.find().populate({
            path:'bootcamp',
            select:'name description'
        })    
    }
    const courses= await query;

    res.status(200).json({
        success:true,
        count:courses.length,
        data:courses
    })
})

// @desc      Get single course
// @route     GET /api/v1/course/:id
// @access    Public
exports.getCourse=asyncHandler(async (req,res,next)=>{

    const course= await Course.findById(req.params.id).populate({path:'bootcamp',select:'name description'})
    if(!course){
        return next(new ErrorResponse(`No coure with id ${req.params.id}`))

    }
    res.status(200).json({
        success:true,
        data:course
    })
})

// @desc      Post course
// @route     Post /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addCourse=asyncHandler(async (req,res,next)=>{

    req.body.bootcamp=req.params.bootcampId
    console.log(req.params.bootcampId)
    const bootcamp= await Bootcamp.findById(req.params.bootcampId)
    console.log(bootcamp)
    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp with id ${req.params.bootcampId}`))

    }

    const course = await Course.create(req.body)
    res.status(200).json({
        success:true,
        data:course
    })
})