module.exports={
    ensureAuthenticated:function(req,res,next) {
        if(req.isAuthenticated()){
            req.flash('error','Login');
            res.redirect('/users/login');
        }
    }
}