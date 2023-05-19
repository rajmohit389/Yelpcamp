const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types;
// const User=require('./user.js')

const reviewSchema=new mongoose.Schema({
    body:String,
    rating:Number,
    author:{
        type:ObjectId,
        ref:'User'
    }
})

module.exports=mongoose.model('Review',reviewSchema)