const Campground=require('../models/campground')
const {cloudinary}=require('../cloudinary')

module.exports.index= async (req,res) =>{
    const campgrounds=await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new')
}

module.exports.renderCampground=async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('author')
    .populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    })
    if(!campground){
        req.flash('error','Cannot find the campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}

module.exports.renderEditForm=async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error','Cannot find the campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground})
}

module.exports.createCampground=async (req,res)=>{
    const campground=new Campground(req.body.campground)
    campground.images=req.files.map(file=>({url:file.path,filename:file.filename}))
    campground.author=req.user._id
    await campground.save()
    req.flash('success','Successfully created a Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.editCampground=async (req,res)=>{
    const campground=await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground},{new:true});
    if(!campground){
        req.flash('error','Cannot find the campground')
        return res.redirect('/campgrounds')
    }
    if(req.files){
        const imgs=req.files.map(file=>({url:file.path,filename:file.filename}))
        campground.images.push(...imgs)
    }
    await campground.save();
    if(req.body.deleteImages){
        // console.log(req.body.deleteImages)
        await Campground.findByIdAndUpdate(req.params.id,{$pull:{images:{filename:{$in:req.body.deleteImages}}}});
        (req.body.deleteImages).forEach(async (img) => {
            await cloudinary.uploader.destroy(fileName)
        });
    }
    req.flash('success','Successfully edited a Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground=async (req,res) =>{
    const campground=await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error','Cannot find the campground')
    }
    else{
        await campground.remove()
        req.flash('success','Successfully deleted a Campground')
    }
    res.redirect('/campgrounds')
}
