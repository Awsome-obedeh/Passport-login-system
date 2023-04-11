const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({
    name:{
    type:String,
    required: [true, "You must enter a name"]
},

email:{
    type:String,
    required: [true, "You must enter your email"]
},

password:{
    type:String,
    required: [true, "You must enter your Pasword"]
},

date:{
    type:Date,
    default:Date.now()
}

})

userSchema.pre('save', function (next) {
    // generate salt and password hash
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(this.password, salt);
  
    // replace plain password with the password hash
    this.password = hashedPassword;
  
    next();
  })
// userSchema.pre('save',function (next){
//     const salt=bcrypt.genSaltSync(10);
//     const hashPassword=bcrypt.hashSync(this.password,salt);

//     this.password=hashPassword;
//     next();
// })

const Usermodel =mongoose.model('RegisteredUsers',userSchema);
module.exports=Usermodel;