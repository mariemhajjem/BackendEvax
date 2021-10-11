const mongoose = require("mongoose");

const centerSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  capacity : { type : Number, required: true, default: null  },
  governorate: { type: String, required: true }, 
  city: { type: String, required: true },
  center_capacity: {
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
	}
});

module.exports = mongoose.model("Center", centerSchema);
