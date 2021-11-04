import { Box, Button, Modal, Paper, Typography, Grid } from '@material-ui/core';
import React, { useState } from 'react';
import '../styles/match.css';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 25,
  boxShadow: 24,
  p: 4,
};

const GeneralModal = ({ displayText, isOpen, handleConfirm, handleCloseModal }) => {
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
        <Typography color="primary">
          {displayText}
        </Typography>
        <Grid style={{ marginTop: '10px'}}>
          <Button
            type="submit"
            variant="outlined"
            onClick={handleCloseModal}
            style={{
              backgroundColor: '#cc3733',
              color: 'white',
              marginRight: '20px',
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleConfirm}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default GeneralModal;
