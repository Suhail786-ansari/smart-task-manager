require('dotenv').config(); // Yeh line sabse upar honi chahiye
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Routes import
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database Connect
connectDB();

// Routes use (Prefix se /api hata diya gaya hai)
app.use('/tasks', taskRoutes);
app.use('/auth', authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});