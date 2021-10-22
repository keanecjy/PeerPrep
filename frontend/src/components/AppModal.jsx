import { Dialog, DialogContent, Box } from '@material-ui/core';

export const AppModal = ({
  children,
  open,
  onClose,
  loading,
  headline,
  hideBackdrop,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableBackdropClick={loading}
      disableEscapeKeyDown={loading}
      classes={{
        paper: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: theme.spacing(3),
          maxWidth: 420,
        },
        paperScrollPaper: {
          maxHeight: 'none',
        },
      }}
      hideBackdrop={hideBackdrop ? hideBackdrop : false}
    >
      <DialogTitle
        style={{
          paddingBottom: paddingBottom
            ? paddingBottom && disablePadding
              ? 0
              : paddingBottom
            : theme.spacing(3),
          paddingLeft: disablePadding ? 0 : null,
          paddingRight: disablePadding ? 0 : null,
          paddingTop: disablePadding ? 0 : theme.spacing(2),
          width: '100%',
        }}
        disableTypography
      >
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">{headline}</Typography>
          <IconButton
            onClick={onClose}
            style={{ marginRight: -12, marginTop: -10 }}
            disabled={disabled}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        style={{
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};
