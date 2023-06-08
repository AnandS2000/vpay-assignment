const mongoose = require("mongoose");

const cardSchema = mongoose.Schema({
  id: {
    type: String,
  },
  date: {
    type: Date,
  },
  user: {
    type: String,
  },
  department: {
    type: String,
  },
  software: {
    type: String,
  },
  seats: {
    type: Number,
  },
  amount: {
    type: Number,
  },
});

module.exports = mongoose.model("Card", cardSchema);
