import { parseSecondsToDuration } from '../shared/functions';

const Stopwatch = ({ time }) => {
  return (
    <div className="stopwatch-container">
      <p>{parseSecondsToDuration(time)}</p>
    </div>
  );
};

export default Stopwatch;
