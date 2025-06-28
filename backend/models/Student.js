const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
      name: { type: String, required: true },
      rollNo: { type: String, required: true }
});

module.exports = mongoose.model('Student', studentSchema);
