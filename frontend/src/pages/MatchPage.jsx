import { Box, Button, Modal, Paper, Typography } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import useInterval from '../hooks/useInterval';
import { difficulties, languages, sessionText } from '../match/constants';
import LoadingButton from '../match/LoadingButton';
import SelectionMenu from '../match/SelectionMenu';
import { deleteMatch, getMatch } from '../services/match';
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

const MatchPage = () => {
  const { user } = useContext(UserContext);
  const history = useHistory();

  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [open, openModal] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [count, setCount] = useState(0);

  const closeModal = () => {
    openModal(false);
    setIsRetrying(false);
    setCount(0);
    console.log(`Deleting match for ${user.id}`);
    deleteMatch(user.id, difficulty, language).then((response) => {
      console.log(response);
    });
  };

  useInterval(
    () => {
      if (count === 6) {
        closeModal();
        toast.warn('Failed to find matching user');
        return;
      }

      console.log(`Counter: ${count}`);

      getMatch(user.id, difficulty, language).then((response) => {
        if (response.status) {
          const sessionId = response.sessionId;
          sessionStorage.setItem(
            sessionId,
            JSON.stringify({
              ...response,
              difficulty: response.difficulty.toLowerCase(),
              language: response.language.toLowerCase(),
            })
          );
          setTimeout(() => {
            history.push(`/interview/${sessionId}`);
          }, 150);
        } else {
          setCount((count) => count + 1);
        }
      });
    },
    isRetrying ? 5000 : null
  );

  const DifficultyMenu = () => {
    return (
      <SelectionMenu
        header="Difficulty"
        list={difficulties}
        value={difficulty}
        setValue={setDifficulty}
      />
    );
  };

  const LanguageMenu = () => {
    return (
      <SelectionMenu
        header="Language"
        list={languages}
        value={language}
        setValue={setLanguage}
      />
    );
  };

  const MatchButton = () => {
    return (
      <Button
        style={{
          marginTop: 60,
        }}
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        onClick={() => {
          openModal(true);
          setIsRetrying(true);
        }}
      >
        Start coding!
      </Button>
    );
  };

  return (
    <Box>
      <Paper
        style={{
          minHeight: 300,
          maxWidth: 500,
          padding: 20,
          borderRadius: 10,
        }}
      >
        <Typography color="primary">{sessionText}</Typography>
        <DifficultyMenu />
        <LanguageMenu />
        <MatchButton />
      </Paper>
      <Modal
        open={open}
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
          <LoadingButton loading={true} />
          <Typography color="primary">Matching is in progress...</Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={closeModal}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default MatchPage;
