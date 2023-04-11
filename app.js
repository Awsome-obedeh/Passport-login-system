require ('dotenv').config();
const express=require('express');
const app=express();
const expressLayouts=require('express-ejs-layouts');
const ejs=require('ejs');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const routes=require('./Routes/index.routes.js');
const userRoutes= require('./Routes/users.routes.js');
const passport=require('passport');
require('./passport.js')(passport);



// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// body-parser
app.use(express.urlencoded({extended: false}));

// session decleartion
app.use(session({
    secret:'login',
    saveUninitialized: true,
    resave: true
}));


// Initializing Passport
app.use(passport.initialize());
  
// Starting the passport session
app.use(passport.session());

// connect flash
app.use(flash());

// global variabales
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error=req.flash('error');
    next();
})

// connect to mongo atlas
async function main() {
    
await mongoose.connect(process.env.DB_URI)
console.log('connected to mongo db');
}
main().catch(err=> console.log(err))




app.use('/',routes);
app.use('/users',userRoutes);

console.log(process.env.DB_URI);



const PORT=process.env.PORT || 4000;
app.listen(PORT, console.log(`app running on port ${PORT}`));