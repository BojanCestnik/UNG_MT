const startTimer = () => {
    // Check if input is valid and the timer is not already running
    if (!isRunning && inputSeconds) {
      const startingTime = parseInt(inputSeconds);
      setTimeLeft(startingTime);
      setIsRunning(true);

      // Start an interval to count down every second
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current); // Stop timer when it reaches 0
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  };