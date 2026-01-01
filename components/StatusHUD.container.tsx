
import React, { useState, useEffect } from 'react';
import { StatusHUDView } from './StatusHUD.view';

const StatusHUDContainer: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour12: false }));
      if (Math.random() > 0.8) setLatency(Math.floor(Math.random() * 15) + 15);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <StatusHUDView time={time} latency={latency} />;
};

export default StatusHUDContainer;
