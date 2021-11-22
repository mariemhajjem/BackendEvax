const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  cin: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  birthday: { type: Date, required: true },
  governorate: { type: String, required: true },
  city: { type: String, required: true },
  code: { type: String },
  creation_date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["admin", "enrolled", "operator", "volunteer"],
    default: "enrolled",
  },
  vaccines: [
    {
      vaccine: { type: mongoose.Schema.Types.ObjectId, ref: "Vaccine" },
      date: { type: Date, default: Date.now },
    },
  ],
  centers: {
    type: String,
    center: { type: mongoose.Schema.Types.ObjectId, ref: "Center" },

  },
});

module.exports = mongoose.model("Users", userSchema);
