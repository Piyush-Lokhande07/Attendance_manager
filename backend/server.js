const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user',require('./routes/user'));
app.use('/api/class', require('./routes/class'));
app.use('/api/student', require('./routes/student'));
app.use('/api/attendance', require('./routes/attendance'));


app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`)
});


