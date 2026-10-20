'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const HIGH_SCORE_KEY = 'mathGame.highScore';
const DURATION_OPTIONS = [30, 60, 120] as const;
const DEFAULT_DURATION = 60;

type Operator = '+' | '-' | '*' | '/';

interface Question {
  text: string;
  answer: number;
}

interface MissedQuestion extends Question {
  userAnswer: string;
}

type Status = 'idle' | 'playing' | 'finished';

function generateQuestion(): Question {
  const operators: Operator[] = ['+', '-', '*', '/'];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  switch (operator) {
    case '+': {
      const a = 1 + Math.floor(Math.random() * 50);
      const b = 1 + Math.floor(Math.random() * 50);
      return { text: `${a} + ${b}`, answer: a + b };
    }
    case '-': {
      const a = 1 + Math.floor(Math.random() * 50);
      const b = 1 + Math.floor(Math.random() * a);
      return { text: `${a} - ${b}`, answer: a - b };
    }
    case '*': {
      const a = 1 + Math.floor(Math.random() * 12);
      const b = 1 + Math.floor(Math.random() * 12);
      return { text: `${a} × ${b}`, answer: a * b };
    }
    case '/': {
      const b = 1 + Math.floor(Math.random() * 12);
      const answer = 1 + Math.floor(Math.random() * 12);
      const a = b * answer;
      return { text: `${a} ÷ ${b}`, answer };
    }
  }
}

export default function MathGame() {
  const [status, setStatus] = useState<Status>('idle');
  const [duration, setDuration] = useState<number>(DEFAULT_DURATION);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_DURATION);
  const [question, setQuestion] = useState<Question | null>(null);
  const [input, setInput] = useState('');
  const [correct, setCorrect] = useState(0);
  const [missedQuestion, setMissedQuestion] = useState<MissedQuestion | null>(
    null,
  );
  const [highScore, setHighScore] = useState<number | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(HIGH_SCORE_KEY);
    if (stored) setHighScore(parseFloat(stored));
  }, []);

  useEffect(() => {
    if (status !== 'playing') return;
    if (timeLeft <= 0) {
      setStatus('finished');
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, timeLeft]);

  useEffect(() => {
    if (status !== 'finished') return;

    const scorePerMinute = correct / (duration / 60);
    if (highScore === null || scorePerMinute > highScore) {
      setHighScore(scorePerMinute);
      setIsNewHighScore(true);
      window.localStorage.setItem(HIGH_SCORE_KEY, String(scorePerMinute));
    } else {
      setIsNewHighScore(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const startGame = useCallback(() => {
    setCorrect(0);
    setMissedQuestion(null);
    setInput('');
    setTimeLeft(duration);
    setQuestion(generateQuestion());
    setIsNewHighScore(false);
    setStatus('playing');
  }, [duration]);

  useEffect(() => {
    if (status === 'playing') inputRef.current?.focus();
  }, [status, question]);

  const submitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || input.trim() === '') return;

    if (parseInt(input, 10) === question.answer) {
      setCorrect((c) => c + 1);
      setInput('');
      setQuestion(generateQuestion());
    } else {
      setMissedQuestion({ ...question, userAnswer: input });
      setStatus('finished');
    }
  };

  const scorePerMinute =
    status === 'finished' ? correct / (duration / 60) : null;

  return (
    <div className="max-w-xl mx-auto px-6 py-16 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] bg-clip-text text-transparent">
        Math Sprint
      </h1>
      <p className="text-[#475569] dark:text-[#94a3b8] mb-8">
        Answer as many +, −, ×, ÷ questions as you can before time runs out —
        one wrong answer ends the round.
      </p>

      {highScore !== null && (
        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          High score:{' '}
          <span className="font-semibold text-[#2563eb] dark:text-[#60a5fa]">
            {highScore.toFixed(1)}
          </span>{' '}
          questions/min
        </p>
      )}

      {status === 'idle' && (
        <div className="w-full">
          <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Timeframe
          </p>
          <div className="flex justify-center gap-3 mb-8">
            {DURATION_OPTIONS.map((seconds) => (
              <button
                key={seconds}
                onClick={() => setDuration(seconds)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  duration === seconds
                    ? 'bg-[#2563eb] text-white border-[#2563eb]'
                    : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#2563eb]'
                }`}
              >
                {seconds}s
              </button>
            ))}
          </div>
          <button
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-white font-semibold shadow-md hover:opacity-90 transition-opacity"
          >
            Start
          </button>
        </div>
      )}

      {status === 'playing' && question && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-6 text-sm text-gray-500 dark:text-gray-400">
            <span>Correct: {correct}</span>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {timeLeft}s
            </span>
          </div>
          <div className="text-5xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            {question.text}
          </div>
          <form onSubmit={submitAnswer} className="flex gap-3 justify-center">
            <input
              ref={inputRef}
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-32 text-center text-2xl px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Enter
            </button>
          </form>
        </div>
      )}

      {status === 'finished' && scorePerMinute !== null && (
        <div className="w-full">
          {isNewHighScore && (
            <p className="mb-3 text-[#2563eb] dark:text-[#60a5fa] font-semibold">
              New high score!
            </p>
          )}
          <p className="text-lg mb-1 text-gray-900 dark:text-gray-100">
            {correct} correct
          </p>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            {scorePerMinute.toFixed(1)} questions/min
          </p>
          {missedQuestion && (
            <p className="mb-8 text-sm text-red-500 dark:text-red-400">
              {missedQuestion.text} = {missedQuestion.answer} (you answered{' '}
              {missedQuestion.userAnswer || '—'})
            </p>
          )}
          {!missedQuestion && <div className="mb-8" />}
          <button
            onClick={() => setStatus('idle')}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-white font-semibold shadow-md hover:opacity-90 transition-opacity"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
