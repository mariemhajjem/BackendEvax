const mongoose = require("mongoose");

const pharmacySchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  governorate: { type: String, required: true }, 
   city: { type: String, required: true },
  pharmacy_capacity: {
    type: Number,
    required: true,
    default: null
  },
  type_vaccine: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Vaccine",
	},
  number_vaccine: {
		type: Number,
		required: true,
    default: null
	},
  disponibilities :[
    {
      date: {type:String},
      appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      }]
    }
  ] 
});

module.exports = mongoose.model("Pharmacy", pharmacySchema);
