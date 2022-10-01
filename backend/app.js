const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require("cors");
const dotenv = require('dotenv')

const taskroute= require('./routes/task')

dotenv.config()
// middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors());

// create .env file and place
// MURI = mongodb://127.0.0.1:27017/taskmakager
// PORT =8080
// or 
// const MURI = 'mongodb+srv://sujan:1234@cluster0.muh1o.mongodb.net/?retryWrites=true&w=majorityy'
const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(process.env.MURI,connectionParams)
.then( () => {
    console.log('Successfuly Connected to database ')
})
.catch( (err) => {
    console.error(`Error connecting to the database. \n${err}`);
})


app.use('/api/task',taskroute)



            
            
app.listen(process.env.PORT || 8080,()=>{
    console.log(`app is running on port ${process.env.PORT}`)
})