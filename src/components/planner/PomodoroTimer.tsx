import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame, Coffee, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fireConfetti, playChimeSound } from '../../utils/audioAndConfetti';

export const PomodoroTimer: React.FC = () => {
  const { settings, showToast } = useApp();

  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      if (settings.soundEnabled) playChimeSound();
      fireConfetti();
      setIsRunning(false);
      if (mode === 'focus') {
        showToast('🎉 Focus sprint finished! Take a 5-minute breather.', 'success');
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        showToast('⚡ Break over! Ready to crush the next study session?', 'info');
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, settings.soundEnabled, showToast]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = (newMode = mode) => {
    setIsRunning(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const handleSwitchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    resetTimer(newMode);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalDuration = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-xl border border-indigo-800/40 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-white/10 backdrop-blur-sm">
            {mode === 'focus' ? (
              <Flame className="w-4 h-4 text-amber-400" />
            ) : (
              <Coffee className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
            {mode === 'focus' ? 'Deep Study Sprint' : 'Rest & Refresh'}
          </span>
        </div>

        {/* Mode switch tabs */}
        <div className="flex gap-1 bg-black/30 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => handleSwitchMode('focus')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              mode === 'focus' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            25m Study
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('break')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              mode === 'break' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            5m Break
          </button>
        </div>
      </div>

      {/* Clock display */}
      <div className="flex items-baseline justify-center gap-2 my-2">
        <span className="text-5xl sm:text-6xl font-black tracking-tight font-mono text-white">
          {formattedTime}
        </span>
      </div>

      {/* Progress line */}
      <div className="w-full bg-white/10 rounded-full h-1.5 my-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            mode === 'focus' ? 'bg-amber-400' : 'bg-emerald-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-95 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/30'
              : 'bg-white hover:bg-slate-100 text-indigo-950 shadow-white/20'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
        </button>

        <button
          type="button"
          onClick={() => resetTimer()}
          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
          title="Reset timer"
          aria-label="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
