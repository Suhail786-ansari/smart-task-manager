const Task = require('../models/Task');

// 1. Get Tasks
const getTasks = async (req, res) => {
    try {
        let query = { user: req.user };
        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }
        if (req.query.priority) query.priority = req.query.priority;
        if (req.query.category) query.category = req.query.category;

        const tasks = await Task.find(query);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Create Task with initial log
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, category, dueDate } = req.body;
        const timestamp = new Date().toLocaleString();
        
        const newTask = await Task.create({ 
            title, 
            description, 
            status, 
            priority, 
            category, 
            dueDate, 
            logs: [`Task created on ${timestamp}`], // Initial Log
            user: req.user 
        });
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Update Task with status transition logs
const updateTask = async (req, res) => {
    try {
        const currentTask = await Task.findById(req.params.id);
        let updatedLogs = currentTask.logs || [];

        // Agar status change ho raha hai toh log generate karo
        if (req.body.status && req.body.status !== currentTask.status) {
            const timestamp = new Date().toLocaleString();
            updatedLogs.push(`Moved from ${currentTask.status} to ${req.body.status} on ${timestamp}`);
            req.body.logs = updatedLogs;
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Delete Task
const deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task successfully deleted!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };