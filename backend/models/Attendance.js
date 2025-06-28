const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  date: { type: Date, required: true },
  records: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      status: { type: String, enum: ['Present', 'Absent'], required: true }
    }
  ]
}, { timestamps: true });

attendanceSchema.index({ classId: 1, date: 1 }, { unique: true }); 

module.exports = mongoose.model('Attendance', attendanceSchema);
