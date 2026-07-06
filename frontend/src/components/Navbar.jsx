import React, { useState } from 'react';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    
    return (
        <div className="relative">
            {/* Main Icon */}
            <div 
                onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    setShowDetails(false); 
                }} 
                className="w-10 h-10 rounded-full cursor-pointer bg-blue-500 flex items-center justify-center text-white font-bold"
            >
                SU
            </div>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl py-2 border border-slate-700 z-50">
                    
                    {!showDetails ? (
                        <button 
                            onClick={() => setShowDetails(true)} 
                            className="block w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700"
                        >
                            Profile
                        </button>
                    ) : (
                        <>
                            {/* Naam wala section hata diya hai */}
                            <button 
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    window.location.href = '/login';
                                }} 
                                className="block w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;