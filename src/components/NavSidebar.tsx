import React from 'react';
import { NavLink } from 'react-router-dom';

export const NavSidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-sidebar-width bg-white dark:bg-background-dark border-r border-border-subtle shadow-sm flex flex-col p-stack-sm space-y-4 z-50">
      <div className="px-2 py-4">
        <div className="flex items-center space-x-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-slate-900 dark:text-white">ScriptureOS</h1>
        </div>
        <p className="font-micro-detail text-micro-detail text-slate-500 px-1 uppercase tracking-widest">Literary Analysis Engine</p>
      </div>

      <nav className="flex-1 space-y-1">
        <NavLink
          to="/"
          className={({ isActive }: {isActive: boolean}) =>
            `flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
              isActive
                ? 'bg-background-light text-slate-900 font-label-bold'
                : 'text-slate-500 font-body-base hover:bg-background-light hover:text-slate-900'
            }`
          }
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/studio"
          className={({ isActive }: {isActive: boolean}) =>
            `flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
              isActive
                ? 'bg-background-light text-slate-900 font-label-bold'
                : 'text-slate-500 font-body-base hover:bg-background-light hover:text-slate-900'
            }`
          }
        >
          <span className="material-symbols-outlined">biotech</span>
          <span>Analysis Studio</span>
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }: {isActive: boolean}) =>
            `flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
              isActive
                ? 'bg-background-light text-slate-900 font-label-bold'
                : 'text-slate-500 font-body-base hover:bg-background-light hover:text-slate-900'
            }`
          }
        >
          <span className="material-symbols-outlined">description</span>
          <span>Reports & Export</span>
        </NavLink>
        <div className="flex items-center space-x-3 px-3 py-2 text-slate-500 font-body-base hover:bg-background-light hover:text-slate-900 rounded-lg cursor-pointer transition-all duration-200">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-bold">Settings</span>
        </div>
      </nav>

      <div className="mt-auto pt-4 border-t border-border-subtle space-y-1">
        <div className="flex items-center space-x-3 px-3 py-2 text-slate-500 font-body-base hover:bg-background-light hover:text-slate-900 rounded-lg cursor-pointer transition-all">
          <span className="material-symbols-outlined text-[18px]">keyboard</span>
          <span className="font-micro-detail">Shortcuts</span>
        </div>
        <div className="flex items-center space-x-3 px-3 py-2 text-slate-500 font-body-base hover:bg-background-light hover:text-slate-900 rounded-lg cursor-pointer transition-all">
          <span className="material-symbols-outlined text-[18px]">contact_support</span>
          <span className="font-micro-detail">Support</span>
        </div>
      </div>
    </aside>
  );
};
