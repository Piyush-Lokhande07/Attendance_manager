
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const User = require('../models/User');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const auth = require('../middleware/authMiddleware');


//Delete Account
router.delete('/delete', auth, async (req, res) => {
  try {
    const userId = req.user;

    // Delete user
    await User.findByIdAndDelete(userId);

    // Optionally delete user's classes, students, attendance
    await Class.deleteMany({ userId });
    await Student.deleteMany({ userId });
    await Attendance.deleteMany({ userId });

    res.json({ message: 'Account and all related data deleted successfully' });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports=router;