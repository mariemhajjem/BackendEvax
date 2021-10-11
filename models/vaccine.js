const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypeVaccineSchema = new Schema({
    
    Type_id : {
		type: String,
		required: true
	},
    vaccine_type: {
		type: String,
		required: true
	}
	,
	stock: {
		type: String,
		required: true
	},
   
	 
});


module.exports = mongoose.model('Vaccine', TypeVaccineSchema);