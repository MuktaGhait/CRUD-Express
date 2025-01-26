require("dotenv").config()
const express = require('express');
const mongoos = require('mongoose');
const bodyParser = require('body-parser');
const homeRoutes = require('./routers/home');

const app = express();
const port = 3004;
app.use('/uploads', express.static('uploads'));

mongoos.connect("mongodb://localhost:27017/studentdetails", {useNewUrlParser : true})
const db = mongoos.connection;
db.on('eror',()=>{
    console.log("Err is ");
})
db.once('open',()=>{
    console.log("Connected");
})

app.set('view engine','ejs');
app.use(express.static('public'))

// body parser 
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/' , homeRoutes)

app.listen(process.env.PORT || port, () => {
    console.log(`http://localhost:${process.env.PORT}`);
});