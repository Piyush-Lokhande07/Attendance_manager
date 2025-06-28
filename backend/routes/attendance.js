const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const auth = require('../middleware/authMiddleware');
const ExcelJS = require('exceljs');

// ✅ Mark attendance
router.post('/', auth, async (req, res) => {
  const { classId, date, records } = req.body;

  try {
    const existing = await Attendance.findOne({ classId, date });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this date.' });
    }

    const attendance = new Attendance({
      userId: req.user,
      classId,
      date,
      records
    });

    await attendance.save();
    res.status(201).json({ message: 'Attendance saved successfully', attendance });
  } catch (err) {
    console.error('Error saving attendance:', err);
    res.status(500).json({ message: 'Server error while saving attendance', error: err.message });
  }
});



// ✅ Get summary data for all students in a class
router.get('/summary/:classId', auth, async (req, res) => {
  const { classId } = req.params;
  const { start, end } = req.query;

  try {
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }

    const students = await Student.find({ classId });
    const startDate = new Date(start + 'T00:00:00.000Z');
    const endDate = new Date(end + 'T23:59:59.999Z');

    const attendanceRecords = await Attendance.find({
      classId,
      date: { $gte: startDate, $lte: endDate }

    });

    const summary = students.map(student => {
      let presentCount = 0;

      attendanceRecords.forEach(record => {
        const entry = record.records?.find(r => r.studentId.toString() === student._id.toString());
        if (entry?.status === 'Present') presentCount++;
      });

      const total = attendanceRecords.length;
      const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(2) : '0.00';

      return {
        name: student.name,
        rollNo: student.rollNo,
        present: presentCount,
        total,
        percentage
      };
    });

    res.json(summary);
  } catch (err) {
    console.error('Error generating summary:', err);
    res.status(500).json({ message: 'Server error while generating summary', error: err.message });
  }
});

// ✅ Export Excel sheet
router.get('/export/:classId', auth, async (req, res) => {
  const { classId } = req.params;
  const { start, end } = req.query;

  try {
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }

    const students = await Student.find({ classId });
    const attendanceRecords = await Attendance.find({
      classId,
      date: { $gte: new Date(start), $lte: new Date(end) }
    });

    const summary = students.map(student => {
      let presentCount = 0;

      attendanceRecords.forEach(record => {
        const entry = record.records?.find(r => r.studentId.toString() === student._id.toString());
        if (entry?.status === 'Present') presentCount++;
      });

      const total = attendanceRecords.length;
      const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(2) : '0.00';

      return {
        Name: student.name,
        RollNo: student.rollNo,
        Present: presentCount,
        TotalDays: total,
        Percentage: percentage
      };
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance Summary');

    worksheet.columns = [
      { header: 'Name', key: 'Name', width: 25 },
      { header: 'Roll No', key: 'RollNo', width: 15 },
      { header: 'Days Present', key: 'Present', width: 15 },
      { header: 'Total Days', key: 'TotalDays', width: 15 },
      { header: 'Percentage (%)', key: 'Percentage', width: 20 }
    ];

    worksheet.addRows(summary);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance-summary.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error exporting attendance to Excel:', err);
    res.status(500).json({ message: 'Error generating Excel file', error: err.message });
  }
});


// ✅ Get attendance by class and date
router.get('/:classId/:date', auth, async (req, res) => {
  const { classId, date } = req.params;

  try {
    const attendance = await Attendance.findOne({ classId, date }).populate('records.studentId', 'name rollNo');
    if (!attendance) {
      return res.status(404).json({ message: 'No attendance found for this date.' });
    }

    res.json(attendance);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Server error while fetching attendance', error: err.message });
  }
});

//Edit attendace for particular date
router.put('/:classId/:date', auth, async (req, res) => {
  const { classId, date } = req.params;
  const { records } = req.body;

  try {
    const attendance = await Attendance.findOneAndUpdate(
      { classId, date },
      { records },
      { new: true, upsert: true }  // upsert ensures if not found, creates one
    );

    res.json({ message: 'Attendance updated', attendance });
  } catch (err) {
    console.error('Error updating attendance:', err);
    res.status(500).json({ message: 'Server error while updating attendance', error: err.message });
  }
});



module.exports = router;
