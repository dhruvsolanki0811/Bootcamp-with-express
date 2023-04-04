const advanceResults=(model,populate)=>async(req,res,next)=>{
    let query;
advanceResults    //Copying query
    let reqQuery= {...req.query}
    //Fields to be executed
    const removeField=['select','sort','page','limit']
  
    // Removing fields from copied req object
    removeField.forEach(p => delete reqQuery[p])
    
    let queryStr= JSON.stringify(reqQuery)
    queryStr= queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`)  
    console.log(JSON.parse(queryStr))
    query= model.find(JSON.parse(queryStr))
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
    const total= await model.countDocuments()
    query= query.skip(startIndex).limit(limit)
  
    const pagination={}
    if(populate){
        query=query.populate(populate)
    }

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
    const results= await query
    res.advanceResults={success:true,count:results.length,pagination,data:results}
    console.log(res.advanceResults)
    next()
}
module.exports=advanceResults;