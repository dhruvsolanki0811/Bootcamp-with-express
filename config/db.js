const mongoose=  require('mongoose');

const connecttodb= async ()=>{
    mongoose.set("strictQuery", false);

    const conn= await mongoose.connect(`mongodb+srv://${process.env.MONGO_URI}`,{ useNewUrlParser: true })


console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
}   


module.exports=connecttodb