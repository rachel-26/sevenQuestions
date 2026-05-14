import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/studio': return 'Analysis Studio';
      case '/reports': return 'Reports & Export';
      default: return 'ScriptureOS';
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-gutter h-16 sticky top-0 z-40 bg-white border-b border-border-subtle shadow-sm">
      <div className="flex items-center gap-8">
        <h2 className="font-headline-md text-headline-md text-slate-900">{getTitle()}</h2>
        <nav className="hidden md:flex space-x-6">
          <NavLink to="/" className={({isActive}: {isActive: boolean}) => `font-label-bold cursor-pointer transition-colors ${isActive ? 'text-slate-900 border-b-2 border-amber-500 pb-1' : 'text-slate-500 hover:text-slate-900'}`}>Dashboard</NavLink>
          <NavLink to="/studio" className={({isActive}: {isActive: boolean}) => `font-label-bold cursor-pointer transition-colors ${isActive ? 'text-slate-900 border-b-2 border-amber-500 pb-1' : 'text-slate-500 hover:text-slate-900'}`}>Analysis Studio</NavLink>
          <NavLink to="/reports" className={({isActive}: {isActive: boolean}) => `font-label-bold cursor-pointer transition-colors ${isActive ? 'text-slate-900 border-b-2 border-amber-500 pb-1' : 'text-slate-500 hover:text-slate-900'}`}>Reports</NavLink>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-4 text-slate-500">
          <span className="material-symbols-outlined cursor-pointer hover:text-slate-900" data-icon="notifications">notifications</span>
          <span className="material-symbols-outlined cursor-pointer hover:text-slate-900" data-icon="help_outline">help_outline</span>
        </div>
        {location.pathname === '/reports' && (
          <button className="px-4 py-1.5 border border-border-subtle rounded-lg text-slate-900 font-label-bold text-[13px] hover:bg-slate-50 transition-colors">Export</button>
        )}
        <button className="px-4 py-1.5 bg-primary text-white rounded-lg font-label-bold text-[13px] hover:bg-blue-700 shadow-sm transition-colors">
          New Analysis
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ml-2 border border-border-subtle flex items-center justify-center">
          <span className="material-symbols-outlined text-slate-500">person</span>
        </div>
      </div>
    </header>
  );
};
