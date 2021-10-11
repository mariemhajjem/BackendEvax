const mongoose = require("mongoose"); 

const userSchema = new mongoose.Schema({
  cin: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  birthday: { type: Date, required: true },
  address: {
    governorate: { type: String, required: true }, 
    delegation: { type: String, required: true },
  },
  role: {
		type: String,
		required: true,
		enum: ['admin', 'enrolled', "operator", "volunteer"],
		default: 'enrolled'
	},
	vaccinesDates: [
		{ 
			type: Date,  
		}
	]
});
 
module.exports = mongoose.model("Users", userSchema);
