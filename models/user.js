const mongoose = require("mongoose"); 

const userSchema = new mongoose.Schema({
  cin: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  birthday: { type: Date }, 
  creation_date: {
		type: Date, 
		default: Date.now
	},
  role: {
		type: String, 
		enum: ['admin', 'enrolled', "operator", "volunteer"],
		default: 'enrolled'
	},
	vaccines: [
		{
			vaccine: { type: mongoose.Schema.Types.ObjectId, ref: "Vaccine"},
			date: { type: Date,  default: Date.now}
		}
	]
});
 
module.exports = mongoose.model("Users", userSchema);
