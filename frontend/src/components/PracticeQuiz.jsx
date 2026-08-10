import React, { useState, useEffect } from 'react';

export default function PracticeQuiz({ quizzes, onSwitchTab }) {
  const [deck, setDeck] = useState([]);
  const [deckIndex, setDeckIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  
  // Streak and scoring state
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('engpractice_streak');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);

  // Sync streak to localStorage
  useEffect(() => {
    localStorage.setItem('engpractice_streak', streak);
  }, [streak]);

  // Fisher-Yates shuffle
  const shuffleDeck = (list) => {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Re-shuffle deck when quizzes array changes or component mounts
  useEffect(() => {
    if (quizzes && quizzes.length > 0) {
      setDeck(shuffleDeck(quizzes));
      setDeckIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(null);
    } else {
      setDeck([]);
    }
  }, [quizzes]);

  // If no quizzes exist, render a beautiful empty state
  if (quizzes.length === 0) {
    return (
      <div className="mx-auto max-w-2xl text-center py-16 px-4">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/20 p-12 backdrop-blur-md shadow-2xl">
          <span className="text-6xl animate-bounce">📚</span>
          <h2 className="mt-6 text-2xl font-bold text-white tracking-tight">Your Deck is Empty</h2>
          <p className="mt-3 text-sm text-slate-400 max-w-md leading-relaxed">
            You don't have any quizzes to practice right now. Jump over to the Creator tab to build your deck!
          </p>
          <button
            onClick={() => onSwitchTab('manage')}
            className="mt-8 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-indigo-600/40 active:scale-[0.98]"
          >
            ➕ Add Your First Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuiz = deck[deckIndex];
  if (!currentQuiz) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const handleOptionClick = (option) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);
    const correct = option === currentQuiz.answer;
    setIsCorrect(correct);

    // Update stats
    setTotalAttempted((prev) => prev + 1);
    if (correct) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);

    if (deckIndex + 1 >= deck.length) {
      // Shuffling deck for another round
      setDeck(shuffleDeck(quizzes));
      setDeckIndex(0);
    } else {
      setDeckIndex((prev) => prev + 1);
    }
  };

  const handleResetStats = () => {
    setScore(0);
    setTotalAttempted(0);
    setStreak(0);
  };

  const letters = ['A', 'B', 'C', 'D'];
  const accuracy = totalAttempted > 0 ? Math.round((score / totalAttempted) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Streak */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-md shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Streak</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-white">
            {streak} <span className="text-xs font-normal text-slate-400">consecutive</span>
          </p>
          {streak >= 5 && (
            <div className="absolute right-2 bottom-2 text-xl animate-pulse">⚡</div>
          )}
        </div>

        {/* Accuracy */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-md shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Accuracy</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-white">
            {accuracy}%
          </p>
        </div>

        {/* Score */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-md shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Session Score</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-white">
            {score}<span className="text-sm font-medium text-slate-500">/{totalAttempted}</span>
          </p>
        </div>

        {/* Deck Progress */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-md shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Card</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-white">
            {deckIndex + 1}<span className="text-sm font-medium text-slate-500">/{deck.length}</span>
          </p>
        </div>
      </div>

      {/* Main Quiz Practice Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-md shadow-2xl transition-all duration-300">
        {/* Card Header Progress bar */}
        <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500" style={{ width: `${((deckIndex + 1) / deck.length) * 100}%` }}></div>

        {/* Question Text */}
        <div className="space-y-2 mt-2">
          <span className="inline-block text-[10px] font-extrabold tracking-widest text-indigo-400 uppercase">Practice Quiz</span>
          <h3 className="text-xl font-bold leading-relaxed text-slate-100 sm:text-2xl break-words">
            {currentQuiz.question}
          </h3>
        </div>

        {/* Options List */}
        <div className="mt-8 space-y-3.5">
          {currentQuiz.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrectAnswer = option === currentQuiz.answer;

            let btnClass = 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/60 text-slate-200 hover:scale-[1.01]';
            let badgeClass = 'bg-slate-800 text-slate-400 border-slate-700';

            if (isAnswered) {
              if (isCorrectAnswer) {
                btnClass = 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200';
                badgeClass = 'bg-emerald-500 text-white border-emerald-400';
              } else if (isSelected) {
                btnClass = 'border-rose-500/50 bg-rose-950/20 text-rose-200';
                badgeClass = 'bg-rose-500 text-white border-rose-400';
              } else {
                btnClass = 'border-slate-900/80 bg-slate-950/10 text-slate-600 opacity-40';
                badgeClass = 'bg-slate-950/30 text-slate-700 border-slate-900';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleOptionClick(option)}
                className={`group flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left text-base font-semibold transition-all duration-300 ${btnClass}`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-sm font-extrabold transition-all duration-300 ${badgeClass}`}>
                  {letters[idx]}
                </span>
                <span className="break-words leading-relaxed">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Feedback & Action Panel */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-800/80 pt-6">
          <div>
            {isAnswered && (
              <div className="animate-slide-in">
                {isCorrect ? (
                  <p className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>✨</span> Correct! Well done!
                  </p>
                ) : (
                  <p className="text-base font-bold text-rose-400 flex items-center gap-1.5">
                    <span>❌</span> Incorrect answer.
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  Keep studying, consistency is key!
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Show Reset Stats if attempted anything */}
            {totalAttempted > 0 && (
              <button
                onClick={handleResetStats}
                className="rounded-xl border border-slate-800 bg-transparent px-4 py-2.5 text-xs font-semibold text-slate-400 transition-all hover:bg-slate-800/50 hover:text-slate-200"
              >
                Reset Stats
              </button>
            )}

            {/* Next or Skip Button */}
            {isAnswered ? (
              <button
                onClick={handleNext}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]"
              >
                Next Question &rarr;
              </button>
            ) : (
              <button
                onClick={() => handleOptionClick('')} // Fails the question but lets user see answer
                className="rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
              >
                Reveal Answer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
