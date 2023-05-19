const Campground=require('../models/campground')
const Review=require('../models/review')

module.exports.createReview=async (req,res)=>{
    const campground=await Campground.findById(req.params.campgroundId)
    if(!campground){
        req.flash('error','Cannot find the campground')
        return res.redirect('/campgrounds')
    }
    const newReview=new Review(req.body.review)
    newReview.author=req.user._id
    campground.reviews.push(newReview)
    await newReview.save()
    await campground.save()
    req.flash('success','Successfully added a review')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview=async (req,res)=>{
    const campground=await Campground.findByIdAndUpdate(req.params.campgroundId,{
        $pull:{reviews:req.params.reviewId}
    },{
        new:true
    })
    const review=await Review.findByIdAndDelete(req.params.reviewId)
    if(!campground){
        req.flash('error','Cannot find the campground')
        return res.redirect('/campgrounds')
    }
    if(!review){
        req.flash('error','Cannot find the review')
    }
    res.redirect(`/campgrounds/${campground._id}`)
}