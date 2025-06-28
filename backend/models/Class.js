const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who owns the class
  name: { type: String, required: true },
  subject: { type: String }
});

module.exports = mongoose.model('Class', classSchema);
