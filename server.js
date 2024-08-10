const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();

connectDB();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173'
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/timetable', timetableRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
