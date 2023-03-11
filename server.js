const express = require('express')
const dotenv= require('dotenv')
const color= require('colors')
const path = require('path');
const cookieParser = require('cookie-parser')
const app = express()
const port = process.env.PORT || 5000 
dotenv.config({path:'./config/config.env'})
const bootcamps=require('./routes/bootcamps')
const courses=require('./routes/courses')
const auth=require('./routes/auth')

var morgan = require('morgan')
var conn = require('./config/db')
const errorHandler = require('./error/error')
const fileupload = require('express-fileupload')

app.use(express.json())
app.use(cookieParser())

//Dev logging middle ware
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

conn();
app.use(fileupload())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps',bootcamps)
app.use('/api/v1/courses',courses)
app.use('/api/v1/auth',auth)

app.use(errorHandler)
const server=app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} listening on port ${port}!`.yellow.bold))


// const {logger}=require('./middleware/logger') //Custom logger
// app.use(logger)  

process.on('unhandledRejection',(err)=>{

    console.log(`Error mssg: ${err.message}`.red)
    server.close(()=>{process.exit(1)})
})