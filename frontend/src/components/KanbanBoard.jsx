import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [category, setCategory] = useState('General');
    const [dueDate, setDueDate] = useState('');
    const [search, setSearch] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [darkMode, setDarkMode] = useState(true);

    const fetchTasks = async () => {
        try {
            const res = await API.get(`/tasks?search=${search}&priority=${filterPriority}&category=${filterCategory}`);
            setTasks(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchTasks(); }, [search, filterPriority, filterCategory]);

    const onDragStart = (e, taskId) => { e.dataTransfer.setData("taskId", taskId); };
    const onDragOver = (e) => { e.preventDefault(); };
    const onDrop = async (e, targetStatus) => {
        const taskId = e.dataTransfer.getData("taskId");
        await API.put(`/tasks/${taskId}`, { status: targetStatus });
        fetchTasks();
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!title) return;
        try {
            await API.post('/tasks', { title, description, priority, category, dueDate });
            setTitle(''); setDescription(''); setPriority('Medium'); setCategory('General'); setDueDate('');
            fetchTasks();
        } catch (err) { console.error(err); }
    };

    const handleStatusChange = async (id, newStatus) => {
        await API.put(`/tasks/${id}`, { status: newStatus });
        fetchTasks();
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm("Delete task?")) {
            await API.delete(`/tasks/${id}`);
            fetchTasks();
        }
    };

    const handleLogout = () => { localStorage.removeItem('token'); window.location.href = '/'; };

    const totalTasks = tasks.length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const highRisk = tasks.filter(t => t.priority === 'High').length;
    const progress = totalTasks > 0 ? Math.round((tasks.filter(t => t.status === 'Done').length / totalTasks) * 100) : 0;

    return (
        <div className={`min-h-screen p-6 ${darkMode ? 'bg-[#0f172a] text-white' : 'bg-slate-50 text-slate-900'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Smart Task Manager</h1>
                    <div className="flex gap-4">
                        <button onClick={() => setDarkMode(!darkMode)} className="px-4 py-2 bg-slate-800 rounded-lg">Mode</button>
                        <button onClick={handleLogout} className="px-4 py-2 bg-rose-600 rounded-lg text-white">Logout</button>
                    </div>
                </div>

                {/* Work Summary */}
                <h2 className="text-lg font-bold mb-4">Work Summary</h2>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-slate-800 rounded-xl"><p className="text-xs text-slate-400">Total</p><p className="text-2xl font-bold">{totalTasks}</p></div>
                    <div className="p-4 bg-slate-800 rounded-xl"><p className="text-xs text-slate-400">In Progress</p><p className="text-2xl font-bold text-amber-500">{inProgress}</p></div>
                    <div className="p-4 bg-slate-800 rounded-xl"><p className="text-xs text-slate-400">High Risk</p><p className="text-2xl font-bold text-rose-500">{highRisk}</p></div>
                    <div className="p-4 bg-slate-800 rounded-xl"><p className="text-xs text-slate-400">Progress</p><p className="text-2xl font-bold text-emerald-500">{progress}%</p></div>
                </div>

                {/* Search & Filters */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-3 bg-slate-800 rounded-lg" />
                    <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="p-3 bg-slate-800 rounded-lg"><option value="">All Priorities</option><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select>
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="p-3 bg-slate-800 rounded-lg"><option value="">All Categories</option><option value="General">General</option><option value="College">College</option><option value="Personal">Personal</option><option value="Work">Work</option></select>
                </div>

                {/* Task Form */}
                <form onSubmit={handleAddTask} className="grid grid-cols-2 gap-4 mb-8 bg-slate-800 p-6 rounded-2xl">
                    <input placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} className="p-3 bg-slate-700 rounded-lg" />
                    <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="p-3 bg-slate-700 rounded-lg" />
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="p-3 bg-slate-700 rounded-lg"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-3 bg-slate-700 rounded-lg"><option value="General">General</option><option value="College">College</option><option value="Work">Work</option><option value="Personal">Personal</option></select>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="p-3 bg-slate-700 rounded-lg" />
                    <button type="submit" className="bg-blue-600 rounded-lg text-white">Create Task</button>
                </form>

                {/* Kanban Board */}
                <div className="grid grid-cols-3 gap-6">
                    {['Todo', 'In Progress', 'Done'].map(col => (
                        <div key={col} onDragOver={onDragOver} onDrop={(e) => onDrop(e, col)} className="p-5 bg-slate-800 rounded-xl min-h-[500px]">
                            <h2 className="font-bold mb-4">{col}</h2>
                            {tasks.filter(t => t.status === col).map(task => (
                                <div key={task._id} draggable onDragStart={(e) => onDragStart(e, task._id)} className="p-4 mb-3 bg-slate-700 rounded-lg cursor-grab">
                                    <h3 className="font-bold">{task.title}</h3>
                                    <p className="text-xs text-slate-400">{task.category} • {task.priority}</p>
                                    <p className="text-xs text-amber-400">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                                    <div className="flex gap-2 mt-2">
                                        {col !== 'Todo' && <button onClick={() => handleStatusChange(task._id, col === 'Done' ? 'In Progress' : 'Todo')} className="text-xs text-blue-400">◀ Back</button>}
                                        <button onClick={() => handleDeleteTask(task._id)} className="text-xs text-rose-400">Delete</button>
                                        {col !== 'Done' && <button onClick={() => handleStatusChange(task._id, col === 'Todo' ? 'In Progress' : 'Done')} className="text-xs text-blue-400">Next ▶</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;