const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types;
const Review=require('./review')
const {cloudinary}=require('../cloudinary')

const ImageSchema=new mongoose.Schema({
    url:String,
    filename:String
})

ImageSchema.virtual('thumbnail').get(function(){
    return (this.url).replace('/upload','/upload/w_200')
})

const CampgroundSchema=new mongoose.Schema({
    title:String,
    images:[ImageSchema],
    price:Number,
    description:String,
    location:String,
    author:{
        type:ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:ObjectId,
            ref:'Review'
        }
    ]
})

CampgroundSchema.post('remove',async (doc)=>{
    if(doc){
        await Review.deleteMany({
            _id:{$in:doc.reviews}
        })
        doc.images.forEach(async (img) => {
            await cloudinary.uploader.destroy(img.filename)
        })
    }
})

module.exports=mongoose.model('Campground',CampgroundSchema)
