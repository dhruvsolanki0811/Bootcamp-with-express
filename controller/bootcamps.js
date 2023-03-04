const Bootcamp = require('../model/Bootcamp')
const ErrorResponse= require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');


//@desc     Get all the bootcamps
//@route    GET /api/v1/bootcamps
//access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  //Copying query
  let reqQuery= {...req.query}
  //Fields to be executed
  const removeField=['select','sort','page','limit']

  // Removing fields from copied req object
  removeField.forEach(p => delete reqQuery[p])
  
  let queryStr= JSON.stringify(reqQuery)
  queryStr= queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`)  
  console.log(JSON.parse(queryStr))
  query= Bootcamp.find(JSON.parse(queryStr))
  //select
  if(req.query.select){
    const fields= req.query.select.split(',').join(' ')
    console.log(fields)
    query=query.select(fields)
  }

  if(req.query.sort){
    const sortFields= req.query.sort.split(',').join(' ')
    console.log(sortFields)
    query=query.sort(sortFields)
  }
  else{
    query=query.sort('-createdAt')
  }
  // console.log(query)

  //Pagination and limit
  let page = parseInt(req.query.page,10)||1;
  let limit = parseInt(req.query.limit,10)||100;

  const startIndex=(page-1)*limit
  const endIndex= (page)*limit
  const total= await Bootcamp.countDocuments()
  query= query.skip(startIndex).limit(limit)

  const pagination={}

  if(endIndex<total){
    pagination.next={
      page:page+1,
      limit
    }
  }
  if(startIndex>0){
    pagination.prev={
      page:page-1,
      limit
    }
  }
  const bootcamps= await query
  res.status(200).json({success:true,count:bootcamps.length,pagination:pagination,data:bootcamps})
  
 
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

    const bootcamp= await Bootcamp.findByIdAndDelete(
    req.params.id)
    if(!bootcamp){
      return res.status(400).json({success:false})
    }
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