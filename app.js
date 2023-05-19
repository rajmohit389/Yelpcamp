
require('dotenv').config()

const port=process.env.port || 3000
const express=require('express')
const app=express()
const path=require('path')
const mongoose=require('mongoose')
const methodOverride=require('method-override')
const ejsMate=require('ejs-mate')
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport')
const LocalStrategy=require('passport-local')
const mongoSanitize=require('express-mongo-sanitize')

const ExpressError=require('./utils/expressError')

const userRoutes=require('./routes/users')
const campgroundRoutes=require('./routes/campgrounds')
const reviewRoutes=require('./routes/reviews')

const User=require('./models/user')

mongoose.set('strictQuery',false)//to avoid depriciation warning
mongoose.connect(process.env.mongourl,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

const db=mongoose.connection
db.on('error',console.error.bind(console,'connection error'))
db.once('open',()=>{
    console.log('Database connected')
})

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize({
    replaceWith:'_'
}))

const sessionConfig={
    secret:'thiscouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly : true,
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser=req.user
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next()
})

app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:campgroundId/reviews',reviewRoutes)

app.get('/',(req,res) => {
    res.render('home')
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    const {message='Oh!! Something went wrong',statusCode=500} = err
    if(process.env.NODE_ENV==="production"){
        err.stack=null;
    }
    res.status(statusCode).render('error',{err})
})

app.listen(port,()=>{
    console.log('Server running on port 3000')
})
