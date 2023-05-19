const express=require('express')
const router=express.Router();
const catchAsync=require('../utils/catchAsync')
const {validateCampground,loggedIn,isAuthorisedCamp}=require('../middleware')
const campgrounds=require('../controllers/campgrounds')
const multer=require('multer')
const {storage}=require('../cloudinary')
const upload=multer({storage})

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(loggedIn,upload.array('images'),validateCampground,catchAsync(campgrounds.createCampground))
    // .post(loggedIn,upload.array('images'),validateCampground,(req,res)=>{
    //     // console.log(req.files)
    //     res.send('It worked')
    // })

router.get('/new',loggedIn,campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.renderCampground))
    .put(loggedIn,isAuthorisedCamp,upload.array('images'),validateCampground,catchAsync(campgrounds.editCampground))
    .delete(loggedIn,isAuthorisedCamp,catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',loggedIn,isAuthorisedCamp,catchAsync(campgrounds.renderEditForm))

module.exports=router