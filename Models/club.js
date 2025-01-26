const mongoose = require('mongoose');
const schema = mongoose.Schema;

let clubScheema = new schema({
    name :{
        type:String
    },
    email:{
        type :String
    },
    uploaded_file:{
        type :Buffer
    }
})

module.exports = mongoose.model('student', clubScheema)