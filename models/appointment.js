const mongoose = require('mongoose'); 

const appointSchema = mongoose.Schema({
    appointmentDate : { type : Date, required : true},
    appointmentTime : { type : Date, required : true},
    center : { type : mongoose.Schema.Types.ObjectId, ref :"Center"},
    user : { type : mongoose.Schema.Types.ObjectId, ref :"User"},
})
module.exports = mongoose.model('Appointment',appointSchema);