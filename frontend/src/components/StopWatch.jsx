import React, { useState, useEffect } from 'react';

const Stopwatch = ({ time }) => {
  const [second, setSecond] = useState('00');
  const [min, setMin] = useState('00');
  const [hour, setHour] = useState('00');

  useEffect(() => {
    const newSecond = beautifyTime(time % 60);
    const newMin = beautifyTime(Math.floor(time / 60) % 60);
    const newHour = beautifyTime(Math.floor(time / 3600));
    setSecond(newSecond);
    setMin(newMin);
    setHour(newHour);
  }, [time]);

  const beautifyTime = (arg) => {
    if (arg < 10) {
      return '0' + arg;
    }

    return arg.toString();
  };

  return (
    <div className="stopwatch-container">
      <p>{`${hour}`}</p>
      <p>{`:${min}`}</p>
      <p>{`:${second}`}</p>
    </div>
  );
};

export default Stopwatch;
