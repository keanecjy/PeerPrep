import { Box, Button, Modal, Grid } from '@material-ui/core';
import React from 'react';
import '../styles/match.css';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 400,
  maxWidth: 500,
  bgcolor: 'background.paper',
  borderRadius: 15,
  boxShadow: 24,
  p: 3,
};

const GeneralModal = ({
  children,
  isOpen,
  handleConfirm,
  handleCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  return (
    <Modal
      open={isOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={modalStyle}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
        <Grid style={{ marginTop: '30px' }}>
          {handleCancel && (
            <Button
              type="submit"
              variant="outlined"
              onClick={handleCancel}
              style={{
                backgroundColor: '#cc3733',
                color: 'white',
                marginRight: handleConfirm ? '20px' : 'inherit',
              }}
            >
              {cancelText}
            </Button>
          )}
          {handleConfirm && (
            <Button
              type="submit"
              onClick={handleConfirm}
              variant="contained"
              color="primary"
            >
              {confirmText}
            </Button>
          )}
        </Grid>
      </Box>
    </Modal>
  );
};

export default GeneralModal;
