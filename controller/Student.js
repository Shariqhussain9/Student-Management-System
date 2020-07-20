const router=require('express').Router();
const passport=require('passport');
const bcrypt=require('bcryptjs');
const Student=require('../modals/Student.modal');

const checkAuthenicated = function(req,res,next){
    if(req.isAuthenticated()){
        res.set('Cache-Control','no-cache,private,no-store,must-relative,post-check=0,pre-check=0');
        return next();
    }
    else{
        res.redirect('/Admin/login');
    }
};

router.get('/',(req,res)=>{
    res.render('login',{title:1});
});


router.get('/search',(req,res)=>{
    res.send('search');
});


router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/Student/dashboard',
        failureRedirect:'/Student/login',
        failureFlash:true
    })(req,res,next);
});

router.get('/dashboard',checkAuthenicated,(req,res)=>{
    Student.findOne({email:require('../config/passport').email1},(err,data)=>{
        if(!err){
            console.log(require('../config/passport').email1);
            console.log(data);
            res.render('dashboard',{stud:data,key:1});
        }
    })
});


router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg',"You are logged Out");
    res.redirect('/Student/login');
});
router.get('/student_Edit',(req,res)=>{
    res.render('addorEdit',{add:1});
    Student.findOne({email:require('../config/passport').email1},(err,data)=>{
        if(!err){
            console.log(require('../config/passport').email1);
            console.log(data);
            res.render('addorEdit',{data,add:1});
        }
    })

});


router.post('/student_register',(req,res)=>{
    const {name,fname,Dob,email,Contact,password,password2,Address}=req.body;
   

    let errors=[];
    if(!name||!email||!Contact||!Address||!password||!password2||!Dob||!fname){
        errors.push({msg:"Require all fields"})
    }
    if(password2!=password){
        errors.push({msg:"Password need to match"});
    }
    if(password.length<6){
        errors.push({msg:"Password is to week"});
    
    }
    if(errors.length>0){
        res.render('addorEdit',{errors,name,email,Address,fname,Dob,password2,password,Contact,add:1});
       
    }
    else{
        const newStudent=new Student({
            name,
            fname,
            Dob,
            email,
            Contact,
            password,
            Address

        });
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newStudent.password, salt, (err, hash) => {
            if(err) throw err;
            newStudent.password=hash;
            Student.findOneAndUpdate({email:email},newStudent)
                .then(stud=>{
                    req,flash('success_msg','Updated');
                    res.redirect('/Student/dashboard');
                    console.log('Updated');
                })
            // newStudent.save()
            // .then(stud=>{
            //     req.flash('success_msg', 'Now you are Registered');
            //     res.redirect('/Admin/Dashboard');
            //     console.log("Data Saved");
            // })
            .catch(err=>console.log(err));
            });
        })
    }
});
module.exports=router;