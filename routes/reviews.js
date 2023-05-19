const express=require('express')
const router=express.Router({mergeParams:true})
const catchAsync=require('../utils/catchAsync')
const reviews=require('../controllers/reviews')
const {validateReview,loggedIn,isAuthorisedReview}=require('../middleware')

router.post('/',loggedIn,validateReview,catchAsync(reviews.createReview))

router.delete('/:reviewId',loggedIn,isAuthorisedReview,catchAsync(reviews.deleteReview))

module.exports=router
