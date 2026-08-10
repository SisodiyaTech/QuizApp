import React, { useState } from 'react';

export default function QuizCreator({ onQuizCreated, showToast, apiCall }) {
  const [question, setQuestion] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOption, setCorrectOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !optA || !optB || !optC || !optD || !correctOption) {
      showToast('All fields are required', 'warning');
      return;
    }

    const options = [optA, optB, optC, optD];
    let answer = '';
    if (correctOption === 'A') answer = optA;
    if (correctOption === 'B') answer = optB;
    if (correctOption === 'C') answer = optC;
    if (correctOption === 'D') answer = optD;

    setIsSubmitting(true);
    try {
      await apiCall('/quizzes', {
        method: 'POST',
        body: { question, options, answer },
      });
      showToast('Quiz created successfully!', 'success');
      
      // Reset form
      setQuestion('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setCorrectOption('');
      
      // Callback to refresh list
      onQuizCreated();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg">
      <h2 className="text-lg font-bold text-white">Create New Quiz</h2>
      <p className="mt-1 text-xs text-slate-400">Add a question and exactly four options.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Question */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Question Description
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            placeholder="What is the past tense of 'run'?"
            rows={3}
            className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-950"
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          <label className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Answer Options
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
              A
            </span>
            <input
              type="text"
              value={optA}
              onChange={(e) => setOptA(e.target.value)}
              required
              placeholder="Option A"
              className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 pl-12 pr-4 text-sm text-white placeholder-slate-600 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-950"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
              B
            </span>
            <input
              type="text"
              value={optB}
              onChange={(e) => setOptB(e.target.value)}
              required
              placeholder="Option B"
              className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 pl-12 pr-4 text-sm text-white placeholder-slate-600 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-950"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
              C
            </span>
            <input
              type="text"
              value={optC}
              onChange={(e) => setOptC(e.target.value)}
              required
              placeholder="Option C"
              className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 pl-12 pr-4 text-sm text-white placeholder-slate-600 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-950"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
              D
            </span>
            <input
              type="text"
              value={optD}
              onChange={(e) => setOptD(e.target.value)}
              required
              placeholder="Option D"
              className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 pl-12 pr-4 text-sm text-white placeholder-slate-600 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-950"
            />
          </div>
        </div>

        {/* Correct option selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Correct Answer Option
          </label>
          <select
            value={correctOption}
            onChange={(e) => setCorrectOption(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-white transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-950"
          >
            <option value="" disabled>Choose correct option...</option>
            <option value="A">Option A</option>
            <option value="B">Option B</option>
            <option value="C">Option C</option>
            <option value="D">Option D</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
}
