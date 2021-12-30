const mongoose = require('mongoose'); 

const openDaySchema = mongoose.Schema({
    date : { type : Date /* , required : true */},
    appointmentTime : { type : String/* , required : true */},
    center : { type : mongoose.Schema.Types.ObjectId, ref :"Center",  required : true},
    volunteersList : [{ type : mongoose.Schema.Types.ObjectId, ref :"User", required : true}],
    users : [{ type : mongoose.Schema.Types.ObjectId, ref :"User", required : true}],
    startAge : {type: Number},
    endAge: {type: Number},
    number_vacinne: {type: Number, default:0},
    status: {type: Boolean, default:false},
    vaccine_type:{ type : mongoose.Schema.Types.ObjectId, ref :"Vaccine",  required : true}
})
module.exports = mongoose.model('openDay',openDaySchema);