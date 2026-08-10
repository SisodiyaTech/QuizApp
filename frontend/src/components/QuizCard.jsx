import React, { useState } from 'react';

export default function QuizCard({ quiz, onDelete }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const letters = ['A', 'B', 'C', 'D'];

  const handleOptionClick = (option) => {
    if (selectedOption) return; // Allow only one selection until reset
    setSelectedOption(option);
  };

  const handleReset = () => {
    setSelectedOption(null);
  };

  const isCorrect = selectedOption === quiz.answer;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30">
      {/* Question */}
      <h3 className="flex-grow text-base font-semibold text-slate-100 break-words leading-relaxed">
        {quiz.question}
      </h3>

      {/* Options List */}
      <div className="mt-6 flex flex-col gap-2.5">
        {quiz.options.map((option, idx) => {
          const isCurrentSelected = selectedOption === option;
          const isActualAnswer = option === quiz.answer;
          
          let btnClass = 'border-slate-800 bg-slate-950/30 hover:border-slate-700 hover:bg-slate-950/50';
          let labelClass = 'bg-white/5 text-slate-400';

          if (selectedOption) {
            if (isActualAnswer) {
              // Highlight correct answer in green
              btnClass = 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200';
              labelClass = 'bg-emerald-500 text-white';
            } else if (isCurrentSelected && !isCorrect) {
              // Highlight wrong selected option in red
              btnClass = 'border-rose-500/50 bg-rose-950/20 text-rose-200';
              labelClass = 'bg-rose-500 text-white';
            } else {
              // Dim other options
              btnClass = 'border-slate-900 bg-slate-950/10 text-slate-600 opacity-60';
              labelClass = 'bg-white/2 text-slate-700';
            }
          }

          return (
            <button
              key={idx}
              disabled={!!selectedOption}
              onClick={() => handleOptionClick(option)}
              className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 ${btnClass}`}
            >
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${labelClass}`}>
                {letters[idx]}
              </span>
              <span className="break-words">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Footer / Actions */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
        {showConfirmDelete ? (
          <>
            <span className="text-xs font-semibold text-rose-400">Are you sure?</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onDelete(quiz._id);
                  setShowConfirmDelete(false);
                }}
                className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-rose-500"
                aria-label="Confirm delete quiz"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="rounded-md border border-slate-800 bg-transparent px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Answer Feedback */}
            <div>
              {selectedOption && (
                <span className={`text-xs font-bold tracking-wide uppercase ${
                  isCorrect ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isCorrect ? 'Correct! 🎉' : 'Incorrect ❌'}
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              {selectedOption && (
                <button
                  onClick={handleReset}
                  className="rounded-md border border-slate-800 bg-transparent px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                >
                  Reset
                </button>
              )}
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="rounded-md bg-rose-600/10 px-3 py-1.5 text-xs font-semibold text-rose-400 transition-all hover:bg-rose-600 hover:text-white"
                aria-label="Delete quiz"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
