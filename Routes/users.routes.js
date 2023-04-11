const express=require('express');
const bcrypt=require('bcrypt');

const router=express.Router();
const passport=require('passport');
const Usermodel=require('./../models/users.models');
const ensureAuthenticated=require('./../controllers/app.controllers')


// get login
router.get('/login', (req,res)=>{
    res.render(`login`);
})

// get register
router.get('/register', (req,res)=>{
    res.render(`register`);
})



// get post
router.post('/register', async (req,res)=>{
    // console.log(req.body);
    const { name,email,password,password2 }=req.body;
    // validation
   let error=[];

    // check for required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'please fill in all fields'});
    }

    // check password match
    if(password != password2){
        errors.push({msg:'Password do not match'});
    }
    // check length of password
    if(password.length < 6){
        errors.push({msg:'password length should be upto six characters'});
    }

    if(errors.length>0){

    res.render('register',{
    errors,
    name,
    email,
    password,
    password2
    });
        
    }

    else{
    // chek if user email exists in the database
  const userWithMail=  await Usermodel.findOne({ email : email});
  console.log(userWithMail);
    
    if(userWithMail !=null){
        errors.push({msg:'Email already exits'});
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })

    }

    // inser data into the database
    else{

        // hash the password
    //    const salt= bcrypt.genSaltSync(10);
    //     let newPassword=bcrypt.hashSync(password,salt);
    //     console.log(newPassword);
   

        const newUser=await Usermodel.create({
            
            name,
            email,
            password,
         
        }) 
        console.log(newUser);
        req.flash('success_msg','Registeration Successful, Log in')
        res.redirect('/users/login');
    }

   
    }


   
});

// post login
router.post('/login', async (req,res)=>{
    // passport.authenticate('local',{
    //     successRedirect:'/users/dashboard',
    //     failureRedirect:'/users/login',
    //     failureFlash:true
    // })(req,res,next);
    // res.render('login');

    const { email, password } =req.body;
    console.log(email + password)
    error=[];
    // check if input field is emptyi`
    if(email=='undefined' || password=='undefined'){
        error.push({error:'Provide missing credentials'});
        res.render('login',{error,email,password})

    }

    // match email
   const user= await Usermodel.findOne({email:email});
   console.log(user)
   if(user==null){
    error.push({error:'Invalid email/password'});
    res.render('login',{error,email,password})
   }
  const hasPass=bcrypt.compareSync(password, user.password)
   if(hasPass==false){
    error.push({error:"Invalid email/password"});
    res.render('login',{error,email,password})
   }
   

   if(error.length > 0){
    res.render('login',{error,email,password});

   }
 else{
    res.redirect('/users/dashboard')
    console.log(error)
 }

});

// dashboard routes

router.get('/dashboard',  (req,res)=>{
    res.render('dashboard');
})

// logout 

router.get('/logout', (req,res)=>{
    req.session.destroy;
    req.flash('success_msg', "Login to gain access");
    res.redirect('/users/login');
})
module.exports=router;