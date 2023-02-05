const express = require('express')
const dotenv= require('dotenv')

const app = express()
const port = process.env.PORT || 5000 
dotenv.config({path:'./config/config.env'})

// app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} listening on port ${port}!`))