import { useState, useEffect, useRef } from 'react';

const useTimer = (initialTime) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const startTimer = (duration) => {
    const timeToSet = duration || initialTime;
    setTimeRemaining(timeToSet);
    setTimerRunning(true);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimerRunning(false);
  };

  const resetTimer = () => {
    stopTimer();
    setTimeRemaining(initialTime);
  };

  useEffect(() => {
    if (timerRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]); // eslint-disable-line

  // Helper: Format seconds to MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return {
    timeRemaining,
    timerRunning,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime,
  };
};

export default useTimer;
