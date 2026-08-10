import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import QuizCreator from './components/QuizCreator';
import QuizCard from './components/QuizCard';
import PracticeQuiz from './components/PracticeQuiz';

const API_BASE_URL = 'http://localhost:3000/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState('practice');

  // --- TOAST MANAGER ---
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- API CALL UTILITY ---
  const apiCall = async (endpoint, options = {}) => {
    options.credentials = 'include'; // Essential for cookie-based sessions

    if (options.body && typeof options.body === 'object') {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
      };
      options.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  };

  // --- FETCH FLOWS ---
  const checkUserSession = async () => {
    try {
      const sessionUser = await apiCall('/auth/me');
      if (sessionUser && sessionUser._id) {
        setUser(sessionUser);
      }
    } catch (err) {
      // Ignored: expected if user isn't logged in
    } finally {
      setIsInitializing(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await apiCall('/quizzes');
      setQuizzes(response.quizzes || []);
    } catch (error) {
      showToast('Failed to fetch quizzes', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await apiCall('/auth/logout', { method: 'POST' });
      setUser(null);
      setQuizzes([]);
      showToast('Logged out successfully', 'success');
    } catch (error) {
      showToast('Failed to logout. Please try again.', 'error');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await apiCall(`/quizzes/${quizId}`, { method: 'DELETE' });
      showToast('Quiz deleted', 'success');
      fetchQuizzes();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  // Check user session on initial load
  useEffect(() => {
    checkUserSession();
  }, []);

  // Fetch quizzes once user logs in
  useEffect(() => {
    if (user) {
      fetchQuizzes();
    }
  }, [user]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <span className="text-sm font-medium text-slate-400">Loading your practice hub...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950 text-white">
      {/* Toast Portal */}
      <div className="fixed top-6 right-6 z-9999 flex w-full max-w-sm flex-col gap-3 px-4">
        {toasts.map((toast) => {
          let typeClass = 'border-l-4 border-indigo-500';
          let icon = 'ℹ️';

          if (toast.type === 'success') {
            typeClass = 'border-l-4 border-emerald-500';
            icon = '✅';
          } else if (toast.type === 'error') {
            typeClass = 'border-l-4 border-rose-500';
            icon = '❌';
          } else if (toast.type === 'warning') {
            typeClass = 'border-l-4 border-amber-500';
            icon = '⚠️';
          }

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/90 p-4 backdrop-blur-md shadow-2xl animate-slide-in ${typeClass}`}
            >
              <span className="shrink-0">{icon}</span>
              <div className="flex-grow text-sm text-slate-200">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-slate-500 hover:text-slate-300"
                aria-label="Close alert"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>

      {/* Main Header */}
      <Navbar user={user} onLogout={handleLogout} currentTab={activeTab} onSwitchTab={setActiveTab} />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 lg:px-8">
        {!user ? (
          <Auth
            onAuthSuccess={setUser}
            showToast={showToast}
            apiCall={apiCall}
          />
        ) : activeTab === 'practice' ? (
          <PracticeQuiz quizzes={quizzes} onSwitchTab={setActiveTab} />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column: Creator Form */}
            <div className="lg:col-span-1">
              <QuizCreator
                onQuizCreated={fetchQuizzes}
                showToast={showToast}
                apiCall={apiCall}
              />
            </div>

            {/* Right Column: Quizzes Grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold tracking-tight text-white">Your Practice Quizzes</h2>
                <span className="text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
                  Total Quizzes: {quizzes.length}
                </span>
              </div>

              {quizzes.length === 0 ? (
                <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 py-16 px-4 text-center">
                  <span className="text-4xl">📝</span>
                  <h3 className="mt-4 text-lg font-bold text-white">No Quizzes Yet</h3>
                  <p className="mt-2 text-sm text-slate-400 max-w-xs">
                    Create your first English practice quiz in the left panel to get started!
                  </p>
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {quizzes.map((quiz) => (
                    <QuizCard
                      key={quiz._id}
                      quiz={quiz}
                      onDelete={handleDeleteQuiz}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        <p>&copy; 2026 EngPractice. Built with React, Tailwind CSS, Express, and MongoDB.</p>
      </footer>
    </div>
  );
}

