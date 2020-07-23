const express=require('express');
const expressLayout=require('express-ejs-layouts');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport')
const path=require('path');
const app=express();
const db=require('./modals/key1').MongoUri;

//main hai local ka kaam uthane ke liye
require('./config/passport')(passport);

//set path statically
app.use(express.static(path.join(__dirname,'public')));

const mongoose=require('mongoose');
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
    if(!err) console.log("Database is connected");
    else console.log(err);
});

//setting up ejs
app.use(expressLayout);
app.set('view engine','ejs');

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//middlleware of Session
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:true
}));

//init passport
app.use(passport.initialize());
app.use(passport.session());


//flash middleware
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    next();
});

app.get('/',(req,res)=>{
    res.render('home');
});
app.get('/contactus',(req,res)=>{
    res.render('contactus');
});
app.get('/Aboutus',(req,res)=>{
    res.render('aboutus');
})


app.use('/Admin',require('./controller/Admin'));
app.use('/Student',require('./controller/Student'));




const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`Server Started at ${PORT}`);
});