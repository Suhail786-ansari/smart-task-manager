import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import Navbar from './Navbar';

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
    const [activeLogTaskId, setActiveLogTaskId] = useState(null);

    const fetchTasks = async () => {
        try {
            const res = await API.get(`/tasks?search=${search}&priority=${filterPriority}&category=${filterCategory}`);
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [search, filterPriority, filterCategory]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!title) return;
        try {
            await API.post('/tasks', { title, description, priority, category, dueDate });
            setTitle(''); setDescription(''); setPriority('Medium'); setCategory('General'); setDueDate('');
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await API.put(`/tasks/${id}`, { status: newStatus });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await API.delete(`/tasks/${id}`);
                fetchTasks();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const onDragStart = (e, taskId) => {
        e.dataTransfer.setData("taskId", taskId);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = async (e, targetStatus) => {
        const taskId = e.dataTransfer.getData("taskId");
        if (!taskId) return;
        try {
            await API.put(`/tasks/${taskId}`, { status: targetStatus });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.status === 'Done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const highPriorityCount = tasks.filter(t => t.priority === 'High').length;
    const completionPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    const columns = ['Todo', 'In Progress', 'Done'];

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <div className="max-w-7xl mx-auto px-4 py-6">
                
                {/* Header Section */}
                <div className={`flex flex-col sm:flex-row justify-between items-center mb-6 p-6 rounded-2xl shadow-sm ${darkMode ? 'bg-[#1e293b] border border-slate-800' : 'bg-white border border-slate-200'}`}>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                            Smart Task Manager
                        </h1>
                        <p className="text-sm text-slate-400 mt-1 font-medium">Enterprise Productivity Hub</p>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                        <button onClick={() => setDarkMode(!darkMode)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                        </button>
                        <Navbar />
                    </div>
                </div>

                {/* Dashboard Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className={`p-4 rounded-xl border shadow-sm ${darkMode ? 'bg-[#1e293b]/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Backlog</p>
                        <p className="text-2xl font-black text-blue-500 mt-1">{totalTasks} Tasks</p>
                    </div>
                    <div className={`p-4 rounded-xl border shadow-sm ${darkMode ? 'bg-[#1e293b]/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Sprints</p>
                        <p className="text-2xl font-black text-amber-500 mt-1">{inProgressTasks} In Flight</p>
                    </div>
                    <div className={`p-4 rounded-xl border shadow-sm ${darkMode ? 'bg-[#1e293b]/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">High Risk Items</p>
                        <p className="text-2xl font-black text-rose-500 mt-1">{highPriorityCount} High Alert</p>
                    </div>
                    <div className={`p-4 rounded-xl border shadow-sm ${darkMode ? 'bg-[#1e293b]/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team Velocity</p>
                        <p className="text-2xl font-black text-emerald-500 mt-1">{completionPercentage}% Done</p>
                    </div>
                </div>

                {/* Progress Bar */}
                {totalTasks > 0 && (
                    <div className={`mb-6 p-4 rounded-xl border shadow-sm ${darkMode ? 'bg-[#1e293b]/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
                        </div>
                    </div>
                )}

                {/* Filters Row */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 rounded-xl border ${darkMode ? 'bg-[#1e293b]/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <input type="text" placeholder="🔍 Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className={`p-2.5 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                    <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className={`p-2.5 text-sm rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <option value="">All Priorities</option><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
                    </select>
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={`p-2.5 text-sm rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <option value="">All Categories</option><option value="General">General</option><option value="College">College</option><option value="Personal">Personal</option><option value="Work">Work</option>
                    </select>
                </div>

                {/* Task Form */}
                <form onSubmit={handleAddTask} className={`mb-8 p-6 rounded-2xl border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} className={`p-3 text-sm rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} />
                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className={`p-3 text-sm rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} />
                    <div className="flex gap-4">
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} className={`w-1/2 p-3 text-sm rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <option value="Low">🟢 Low</option><option value="Medium">🟡 Medium</option><option value="High">🔴 High</option>
                        </select>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-1/2 p-3 text-sm rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <option value="General">General</option><option value="College">College</option><option value="Personal">Personal</option><option value="Work">Work</option>
                        </select>
                    </div>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={`p-3 text-sm rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} />
                    <button type="submit" className="md:col-span-2 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all">
                        + Create New Project Task
                    </button>
                </form>

                {/* Kanban Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map((col) => {
                        const filteredTasks = tasks.filter(t => t.status === col);
                        return (
                            <div key={col} onDragOver={onDragOver} onDrop={(e) => onDrop(e, col)} className={`p-5 rounded-2xl border flex flex-col min-h-[500px] ${darkMode ? 'bg-[#1e293b]/60 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                                <h2 className="text-lg font-bold text-blue-400 mb-4">{col} ({filteredTasks.length})</h2>
                                <div className="flex flex-col gap-4">
                                    {filteredTasks.map((task) => (
                                        <div key={task._id} draggable onDragStart={(e) => onDragStart(e, task._id)} className={`p-4 rounded-xl border ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                                            <h3 className="font-bold mb-1">{task.title}</h3>
                                            <p className="text-xs text-slate-400 mb-3">{task.description}</p>
                                            <button onClick={() => handleDeleteTask(task._id)} className="text-[10px] font-bold text-rose-500 uppercase">Delete</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;