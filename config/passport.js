const LocalStrategy=require('passport-local').Strategy;
const bcrypt=require('bcryptjs');
const Admin=require('../modals/Admin.modal');
const mongoose=require('mongoose');

module.exports=function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            Admin.findOne({email:email})
            .then(admin=>{
                module.exports={email1:email};
                if(!admin){
                    return done(null,false,{message:"This email is not registered"});
                }
                bcrypt.compare(password,admin.password,(err,isMatch)=>{
                    if(isMatch){
                        console.log("Match to ho gaya bhai!!");
                        return done(null,admin);

                    }
                    else{
                        return done(null,false,{message:"Password incorrect"})
                    }
                })
            }).catch((err)=>console.log("ERrorrr::"+err))
        }) 
    )
    passport.serializeUser((admin,done)=>{
        done(null,admin._id);
    })
    passport.deserializeUser((_id,done)=>{
        Admin.findById(_id,(err,user)=>{
            done(err,user);
        })
    })

}