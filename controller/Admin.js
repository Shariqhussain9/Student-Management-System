const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Admin = require('../modals/Admin.modal');
const passport=require('passport');
const Student=require('../modals/Student.modal');
const path=require('path');
const multer=require('multer');


var Storage=multer.diskStorage({
    destination:path.join(__dirname,'image/'),
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
});
var upload=multer({
    storage:Storage
}).single('img');
router.get('/login', (req, res) => {
    res.render('login', { title:0});
});
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});
router.get('/', (req, res) => {
    res.send("Chala");
    console.log("chala");
}); 
router.post('/register', (req, res) => {
    const { name, email, password, password2, pid } = req.body;
    let errors = [];
    if (!name || !email || !password || !password2 || !pid) {
        errors.push({ msg: 'Require all Fields' });
        console.log(errors);
    }
    if (password2 !== password) {
        errors.push({ msg: 'Password Need to Match' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Password is to week' });
        console.log("l"+errors.length)
    }
    if (errors.length) {
        res.render('register', {errors, name, email, password, password2, pid });
        console.log("2"+errors);
    }
    else {
        const newAdmin = new Admin({
            name,
            email,
            password,
            pid
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                if (err) throw err;
                newAdmin.password = hash;
                newAdmin.save().then(user => {
                    req.flash('success_msg', 'Now you are Registered');
                    res.redirect('/Admin/login');
                    console.log("Data Saved");
                }).catch(err => console.log(err));
                // res.send(newAdmin);
            })
        })

    }
})

const checkAuthenicated = function(req,res,next){
    if(req.isAuthenticated()){
        res.set('Cache-Control','no-cache,private,no-store,must-relative,post-check=0,pre-check=0');
        return next();
    }
    else{
        res.redirect('/Admin/login');
    }
};


router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/Admin/dashboard',
        failureRedirect:'/Admin/login',
        failureFlash:true
    })(req,res,next);
})


router.get('/dashboard',checkAuthenicated,(req,res)=>{
    Student.find((err,data)=>{
        if(!err){
            res.render('dashboard',{stud:data,key:0})
        }
    });
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg',"You are logged Out");
    res.redirect('/Admin/login');
});


router.get('/student_register',checkAuthenicated,(req,res)=>{
    res.render('addorEdit',{add:0});
});



router.post('/student_register',upload,(req,res)=>{
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
        // console.log(errors+"::::");
        res.render('addorEdit',{errors,name,email,Address,fname,Dob,password2,password,Contact,add:0});
       console.log(name);
       console.log(Dob);
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
            newStudent.save()
            .then(stud=>{
                req.flash('success_msg', 'Now you are Registered');
                res.redirect('/Admin/dashboard');
                console.log("Data Saved");
            })
            .catch(err=>console.log(err));
            });
        })
    }
})
module.exports = router;