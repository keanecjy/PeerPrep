import { CircularProgress } from '@material-ui/core';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded';

const LoadingProgress = ({ loading, success }) => {
  if (loading) {
    return (
      <CircularProgress size={50} thickness={3} style={{ margin: '10px' }} />
    );
  } else if (success) {
    return (
      <CheckCircleOutlineRoundedIcon
        fontSize="inherit"
        style={{ width: 80, height: 80, color: '#558B2F', margin: '10px' }}
      />
    );
  } else {
    return (
      <ErrorOutlineRoundedIcon
        fontSize="inherit"
        style={{ width: 80, height: 80, color: '#C62828', margin: '10px' }}
      />
    );
  }
};

export default LoadingProgress;
