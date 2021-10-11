const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypeVaccineSchema = new Schema({
    vaccine_type: {
		type: String,
		required: true
	},
	stock: {
		type: Number,
		required: true
	},
});


module.exports = mongoose.model('Vaccine', TypeVaccineSchema);