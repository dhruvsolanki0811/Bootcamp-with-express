const Course = require('../model/Course')
const ErrorResponse= require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');

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
            select:'name description    '
        })    
    }
    const courses= await query;

    res.status(200).json({
        success:true,
        count:courses.length,
        data:courses
    })
})