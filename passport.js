const LocalStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
// import user model

const Usermodel=require('./models/users.models.js');


module.exports=function (passport){
    passport.use(
       new LocalStrategy({ usernameField : 'email'}, (email, password, done)=>{

        // mathch provided user mail with the ones in database
        Usermodel.findOne({email:email})
        .then(user=>{
            if(!user){
                return done(null,false, {message:"invalid credentials"});
            }

            // check if password matches
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    return done(null,user);
                }
                else{
                    return done(null,false,{message:"invalid credentials"});
                }
            })
        })
        .catch(err=>console.log(err=>console.log(err)));
       })

    );
    // serialize the user object
    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });
    
    // deserilize user
    passport.deserializeUser(function(id, done) {
        User.findById(id).exec().then(function(user) {
          done(null, user);
        }).catch(function(err) {
          done(err);
        });
      });
}



// passport.use(new LocalStrategy(
//     function(username, password, done) {
//       User.findOne({ username: username }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false); }
//         if (!user.verifyPassword(password)) { return done(null, false); }
//         return done(null, user);
//       });
//     }
//   ))