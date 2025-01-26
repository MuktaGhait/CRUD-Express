const mongoose = require('mongoose');
const slugify = require('slugify');

const DataSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    uploaded_file:{
        type:Buffer,
        required:true
    },
    CreateDate:{
        type:Date,
        default : Date.now()
    },
    slug:{
        type:String,
        required : true,
        unique: true
    }
})


DataSchema.pre('validate',function(next){
    if(this.fname){
        this.slug = slugify(this.fname,{lower:true,strict:true})
    }
    next()
})


module.exports = mongoose.model("Data",DataSchema)