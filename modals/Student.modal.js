const mongoose=require('mongoose');
const StudentSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    fname:{
        type:String,
        required:true
    },
    Dob:{
        type:Date,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    Contact:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    Address:{
        type:String,
        required:true
    }

});

const Student=mongoose.model('Student',StudentSchema);
module.exports=Student;