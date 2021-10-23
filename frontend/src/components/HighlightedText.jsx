import { Typography } from '@material-ui/core';

export const HighlightedText = ({ children, center = false }) => {
  return (
    <div
      style={{
        backgroundColor: 'rgba(253, 200, 69, .3)',
        border: '2px solid rgba(253, 200, 69, .5)',
        padding: '16px',
        borderRadius: '4px',
        width: '100%',
        textAlign: center ? 'center' : undefined,
      }}
    >
      <Typography variant="body2">{children}</Typography>
    </div>
  );
};
