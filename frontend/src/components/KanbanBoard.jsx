import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [category, setCategory] = useState('General');
    const [dueDate, setDueDate] = useState('');
    
    // Search/Filters & Theme States
    const [search, setSearch] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [darkMode, setDarkMode] = useState(true);
    
    // Active Log Card tracking state
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/'; 
    };

    // --- Native Drag and Drop Handlers ---
    const onDragStart = (e, taskId) => {
        e.dataTransfer.setData("taskId", taskId);
    };

    const onDragOver = (e) => {
        e.preventDefault(); // Dropping allow karne ke liye default block hatana padta hai
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

    // --- Advanced Metrics Calculations ---
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.status === 'Done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const todoTasks = tasks.filter(t => t.status === 'Todo').length;
    const highPriorityCount = tasks.filter(t => t.priority === 'High').length;
    const completionPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    const columns = ['Todo', 'In Progress', 'Done'];

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <div className="max-w-7xl mx-auto px-4 py-6">
                
                {/* Header */}
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
                        <button onClick={handleLogout} className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-rose-600/20 transition-all">
                            Logout
                        </button>
                    </div>
                </div>

                {/* Naya Component: Analytics Dashboard Cards & Progress Bar */}
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

                {/* Overall Progress Tracker */}
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

                {totalTasks === 0 && (
                    <div className={`text-center p-12 rounded-2xl border border-dashed mb-8 ${darkMode ? 'bg-[#1e293b]/30 border-slate-700' : 'bg-white border-slate-300'}`}>
                        <p className="text-xl text-slate-400 font-semibold">✨ No active tasks found</p>
                    </div>
                )}

                {/* Kanban Grid with Drag & Drop Droppable Areas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map((col) => {
                        const filteredTasks = tasks.filter(t => t.status === col);
                        return (
                            <div 
                                key={col} 
                                onDragOver={(e) => onDragOver(e)}
                                onDrop={(e) => onDrop(e, col)}
                                className={`p-5 rounded-2xl border shadow-sm flex flex-col min-h-[500px] transition-all duration-200 ${
                                    darkMode ? 'bg-[#1e293b]/60 border-slate-800 focus:bg-slate-800/80' : 'bg-slate-100 border-slate-200'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-700/50">
                                    <h2 className="text-lg font-bold text-blue-400">{col}</h2>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                                        {filteredTasks.length}
                                    </span>
                                </div>
                                
                                <div className="flex flex-col gap-4 overflow-y-auto flex-1">
                                    {filteredTasks.length === 0 ? (
                                        <p className="text-xs text-center text-slate-500 my-auto italic">Drag cards here</p>
                                    ) : (
                                        filteredTasks.map((task) => (
                                            <div 
                                                key={task._id} 
                                                draggable
                                                onDragStart={(e) => onDragStart(e, task._id)}
                                                className={`p-4 rounded-xl border shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200 hover:-translate-y-0.5 ${
                                                    darkMode ? 'bg-[#1e293b] border-slate-800 border-l-4' : 'bg-white border-slate-200 border-l-4'
                                                } ${
                                                    task.priority === 'High' ? 'border-l-rose-500' :
                                                    task.priority === 'Medium' ? 'border-l-amber-500' : 'border-l-emerald-500'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                        {task.category}
                                                    </span>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                                        task.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                                        task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    }`}>{task.priority}</span>
                                                </div>
                                                
                                                <h3 className="font-bold text-base tracking-tight mb-1">{task.title}</h3>
                                                <p className={`text-xs mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{task.description}</p>
                                                
                                                {task.dueDate && (
                                                    <div className="text-[11px] text-amber-500 font-medium mb-2">
                                                        <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                                    </div>
                                                )}

                                                {/* Naya Sub-component: Expandable Activity History Log Details */}
                                                <div className="mt-2 mb-3">
                                                    <button 
                                                        type="button"
                                                        onClick={() => setActiveLogTaskId(activeLogTaskId === task._id ? null : task._id)}
                                                        className="text-[10px] font-semibold text-cyan-400 hover:underline flex items-center gap-1 focus:outline-none"
                                                    >
                                                        📋 {activeLogTaskId === task._id ? "Hide Audit History" : "View Audit History"}
                                                    </button>
                                                    
                                                    {activeLogTaskId === task._id && (
                                                        <div className="mt-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 space-y-1 max-h-24 overflow-y-auto">
                                                            {task.logs && task.logs.map((log, index) => (
                                                                <p key={index} className="border-b border-slate-800/40 pb-0.5 last:border-0">• {log}</p>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Quick Action Manual Buttons */}
                                                <div className="flex justify-between gap-2 pt-2 border-t border-slate-700/30">
                                                    {col !== 'Todo' && (
                                                        <button onClick={() => handleStatusChange(task._id, col === 'Done' ? 'In Progress' : 'Todo')} className={`text-[10px] font-bold px-2 py-1 rounded ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>◀ Back</button>
                                                    )}
                                                    <button onClick={() => handleDeleteTask(task._id)} className="text-[10px] font-bold bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white px-2 py-1 rounded border border-rose-500/20 transition-all ml-auto">Delete</button>
                                                    {col !== 'Done' && (
                                                        <button onClick={() => handleStatusChange(task._id, col === 'Todo' ? 'In Progress' : 'Done')} className="text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded shadow-sm ml-2">Next ▶</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
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