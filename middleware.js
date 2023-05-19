const {campgroundSchema,reviewSchema}=require('./schemas')
const ExpressError=require('./utils/expressError')
const Campground=require('./models/campground')
const Review=require('./models/review')

module.exports.validateCampground=(req,res,next)=>{
    const result=campgroundSchema.validate(req.body)
    if(result.error){
        // console.log(result.error)
        const msg=result.error.details.map(el=>el.message).join(',')
        req.flash('error',msg)
        return res.redirect('/campgrounds/new')
    }
    else{
        next()
    }
}

module.exports.validateReview=async (req,res,next)=>{
    const result=reviewSchema.validate(req.body)
    if(result.error){
        const msg=result.error.details.map(el=>el.message).join(',')
        req.flash('error',msg)
        return res.redirect(`/campgrounds/${req.params.campgroundId}`)
    }
    else{
        next()
    }
}   

module.exports.loggedIn=(req,res,next)=>{
    // console.log(req.user)
    if(!req.isAuthenticated()){
        // console.log(req.originalUrl)
        req.session.returnTo=req.originalUrl
        req.flash('error','You must be logged in')
        // console.log(0,req.session)
        return res.redirect('/login')
    }
    next()
}

module.exports.isAuthorisedCamp= async (req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id)
    if(!campground || !campground.author.equals(req.user._id)){
        req.flash('error','You do not have access for it')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isAuthorisedReview= async (req,res,next) => {
    const {campgroundId,reviewId}=req.params;
    const review=await Review.findById(reviewId)
    if(!review || !review.author.equals(req.user._id)){
        req.flash('error','You do not access for it')
        return res.redirect(`/campgrounds/${campgroundId}`)
    }
    next()
}
