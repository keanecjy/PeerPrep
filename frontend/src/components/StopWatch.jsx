import React from 'react';
import ReactStopwatch from 'react-stopwatch';

const Stopwatch = () => (
  <ReactStopwatch
    seconds={0}
    minutes={0}
    hours={0}
    limit="10:00:00"
    onChange={({ hours, minutes, seconds }) => {
      // do something
    }}
    render={({ formatted }) => {
      return (
        <div className="stopwatch-container">
          <p>{formatted}</p>
        </div>
      );
    }}
  />
);

export default Stopwatch;
