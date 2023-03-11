const Bootcamp = require('../model/Bootcamp')
const ErrorResponse= require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const path = require('path');


//@desc     Get all the bootcamps
//@route    GET /api/v1/bootcamps
//access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  
  res.status(200).json(res.advanceResults)
  
 
});

//@desc     Get single with id the bootcamp
//@route    GET /api/v1/bootcamps/:id
//access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  // console.log(req.query.id)


    const bootcamp= await Bootcamp.findById(req.params.id)
    if(!bootcamp){
      next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`,404))
      }
    res
    .status(200)
    .json({
      success: true,
      data:bootcamp
    });
  
 
 
});

//@desc     Create a bootcamp
//@route    POST /api/v1/bootcamps
//access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // console.log(req.body)'
  const bootcamp= await Bootcamp.create(req.body)
  res.status(201).json({ success: true, data:bootcamp });

});

//@desc     Update a bootcamp with id
//@route    PUT /api/v1/bootcamps/:id
//access    Private
exports.updateBootcamp = asyncHandler(async(req, res, next) => {
    const bootcamp= await Bootcamp.findByIdAndUpdate(
    req.params.id,req.body,{
      new:true,
      runValidators:true
    }
    )
    if(!bootcamp){
      return res.status(400).json({success:false})
    }
    res.status(200).json({ success: true, data:bootcamp });

  
});

//@desc     Delete a bootcamp with id
//@route    DELETE /api/v1/bootcamps/:id
//access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp= await Bootcamp.findById(
    req.params.id)
    if(!bootcamp){
      return res.status(400).json({success:false})
    }
    bootcamp.remove()
    res.status(200).json({ success: true, data:bootcamp });


});


//@desc     Get a bootcamp with zipcode and distance
//@route    Get /api/v1/bootcamps/radius/:zipcode/:distance
//access    Public
exports.radiusSearch = asyncHandler(async (req, res, next) => {

  const {zipcode,distance} =req.params;
  const radius = distance / 3963;
  const loc= await geocoder.geocode(zipcode)
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  const bootcamps= await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  })

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.bootcampPhotoUpdate = asyncHandler(async (req, res, next) => {

  const bootcamp= await Bootcamp.findById(
  req.params.id)
  if(!bootcamp){
    return res.status(400).json({success:false})
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });


});