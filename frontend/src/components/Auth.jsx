import React, { useState } from 'react';

export default function Auth({ onAuthSuccess, showToast, apiCall }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const user = await apiCall('/auth/login', {
        method: 'POST',
        body: { email: loginEmail, password: loginPassword },
      });
      showToast(`Welcome back, ${user.username}!`, 'success');
      onAuthSuccess(user);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerUsername || !registerEmail || !registerPassword) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const resData = await apiCall('/auth/register', {
        method: 'POST',
        body: {
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        },
      });
      showToast('Account created successfully!', 'success');
      onAuthSuccess(resData.user);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl">
        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-black/20">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-4 text-center font-semibold text-sm transition-all duration-200 ${
              activeTab === 'login'
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-white/3'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/1'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-4 text-center font-semibold text-sm transition-all duration-200 ${
              activeTab === 'register'
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-white/3'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/1'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Containers */}
        <div className="p-8">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h2>
                <p className="mt-1 text-sm text-slate-400">Enter your credentials to continue practicing.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Create Account</h2>
                <p className="mt-1 text-sm text-slate-400">Join us to start creating and taking quizzes.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    Username
                  </label>
                  <input
                    type="text"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    required
                    placeholder="johndoe"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    Password
                  </label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
