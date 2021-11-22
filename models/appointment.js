const mongoose = require('mongoose'); 

const appointSchema = mongoose.Schema({
    appointmentDate : { type : Date , default: null/* , required : true */},
    appointmentTime : { type : String, default: null/* , required : true */},
    center : { type : mongoose.Schema.Types.ObjectId, ref :"Center", default: null},
    pharmacy : { type : mongoose.Schema.Types.ObjectId, ref :"Pharmacy", default: null},
    user : { type : mongoose.Schema.Types.ObjectId, ref :"User", required : true },
})
module.exports = mongoose.model('Appointment',appointSchema);