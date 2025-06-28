const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const auth = require('../middleware/authMiddleware');

// Create a class
router.post('/', auth, async (req, res) => {
  const { name, subject } = req.body;
  try {
    const newClass = new Class({ userId: req.user, name, subject });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single class by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const classItem = await Class.findOne({ _id: req.params.id, userId: req.user });

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(classItem);
  } catch (err) {
    console.error('Error fetching class:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get all classes for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const classes = await Class.find({ userId: req.user });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete class (optional)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Class.findOneAndDelete({ _id: req.params.id, userId: req.user });
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Update class info (name or subject)
router.put('/:id', auth, async (req, res) => {
  const { name, subject } = req.body;

  try {
    const updatedClass = await Class.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { name, subject },
      { new: true } // return the updated document
    );

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(updatedClass);
  } catch (err) {
    console.error('Error updating class:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
