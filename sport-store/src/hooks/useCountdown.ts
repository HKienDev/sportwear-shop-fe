import { useState, useEffect, useCallback, useMemo } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface UseCountdownOptions {
  initialDays?: number;
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export const useCountdown = ({
  initialDays = 0,
  initialHours = 0,
  initialMinutes = 0,
  initialSeconds = 0,
  onComplete,
  autoStart = true
}: UseCountdownOptions = {}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: initialDays,
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds
  });

  const [isRunning, setIsRunning] = useState(autoStart);

  // Calculate total seconds for easier comparison
  const totalSeconds = useMemo(() => {
    return timeLeft.days * 86400 + timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
  }, [timeLeft]);

  // Check if countdown is complete
  const isComplete = useMemo(() => totalSeconds <= 0, [totalSeconds]);

  // Update timer logic
  const updateTimer = useCallback(() => {
    setTimeLeft(prev => {
      if (prev.seconds > 0) {
        return { ...prev, seconds: prev.seconds - 1 };
      } else if (prev.minutes > 0) {
        return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
      } else if (prev.hours > 0) {
        return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
      } else if (prev.days > 0) {
        return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
      }
      return prev;
    });
  }, []);

  // Start timer
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Stop timer
  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset timer
  const reset = useCallback(() => {
    setTimeLeft({
      days: initialDays,
      hours: initialHours,
      minutes: initialMinutes,
      seconds: initialSeconds
    });
    setIsRunning(autoStart);
  }, [initialDays, initialHours, initialMinutes, initialSeconds, autoStart]);

  // Set custom time
  const setTime = useCallback((newTime: Partial<TimeLeft>) => {
    setTimeLeft(prev => ({ ...prev, ...newTime }));
  }, []);

  // Format time for display
  const formatTime = useCallback((value: number): string => {
    return value.toString().padStart(2, '0');
  }, []);

  // Timer effect
  useEffect(() => {
    if (!isRunning || isComplete) return;

    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [isRunning, isComplete, updateTimer]);

  // Call onComplete when timer finishes
  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return {
    timeLeft,
    isRunning,
    isComplete,
    totalSeconds,
    start,
    stop,
    reset,
    setTime,
    formatTime
  };
}; 