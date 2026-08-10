import React from 'react';

export default function Navbar({ user, onLogout, currentTab, onSwitchTab }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/60 backdrop-blur-md">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSwitchTab && onSwitchTab('practice')}>
          <span className="text-2xl">⚡</span>
          <h1 className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
            EngPractice
          </h1>
        </div>

        {user && onSwitchTab && (
          <nav className="flex items-center gap-1 bg-slate-900/60 border border-slate-800/60 rounded-xl p-1">
            <button
              onClick={() => onSwitchTab('practice')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                currentTab === 'practice'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              📖 Practice
            </button>
            <button
              onClick={() => onSwitchTab('manage')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                currentTab === 'manage'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              ➕ Add Quiz
            </button>
          </nav>
        )}

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-400 hidden sm:inline">
              Welcome, <span className="text-slate-200 font-semibold">{user.username}</span>
            </span>
            <button
              onClick={onLogout}
              className="rounded-md border border-slate-700 bg-transparent px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-white"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
