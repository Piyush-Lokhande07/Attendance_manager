const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const auth = require('../middleware/authMiddleware');

// Add a student to a class
router.post('/', auth, async (req, res) => {
  const { name, rollNo, classId } = req.body;

  try {
    const existing = await Student.findOne({
      userId: req.user,
      classId,
      rollNo
    });

    if (existing) {
      return res.status(400).json({ message: 'Roll number already exists in this class.' });
    }

    const newStudent = new Student({
      userId: req.user,
      classId,
      name,
      rollNo
    });

    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all students of a class
router.get('/:classId', auth, async (req, res) => {
  try {
    const students = await Student.find({
      userId: req.user,
      classId: req.params.classId
    });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



// (Optional) Delete a student
router.delete('/:id', auth, async (req, res) => {
  try {
    await Student.findOneAndDelete({ _id: req.params.id, userId: req.user });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// PUT /api/student/:id
router.put('/:id', auth, async (req, res) => {
  const { name, rollNo } = req.body;

  try {
    // ✅ First, find the student to get classId
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // ✅ Check if any other student in the same class has this rollNo
    const duplicate = await Student.findOne({
      _id: { $ne: req.params.id },    // Exclude current student
      userId: req.user,
      classId: student.classId,
      rollNo,
    });

    if (duplicate) {
      return res.status(400).json({ message: 'Roll number already exists in this class' });
    }

    student.name = name;
    student.rollNo = rollNo;
    await student.save();

    res.json(student);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});




// PATCH /api/attendance/:classId/:date/:studentId
router.patch('/:classId/:date/:studentId', auth, async (req, res) => {
  const { classId, date, studentId } = req.params;
  const { status } = req.body;

  try {
    const attendance = await Attendance.findOne({ classId, date });
    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });

    const record = attendance.records.find(r => r.studentId.toString() === studentId);
    if (!record) return res.status(404).json({ message: 'Student not found in records' });

    record.status = status;
    await attendance.save();

    res.json({ message: 'Attendance updated', record });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
