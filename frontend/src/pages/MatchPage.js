import { Box, Button, Modal, Typography } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { difficulties, languages, sessionText } from '../match/constants';
import LoadingButton from '../match/LoadingButton';
import SelectionMenu from '../match/SelectionMenu';
import { getMatch } from '../services/match';
import '../styles/match.css';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const MatchPage = () => {
  const user = useContext(UserContext);
  const history = useHistory();

  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [finished, setFinished] = useState(false);
  const [open, openModal] = useState(false);

  const handleMatch = (counter, retry) => {
    console.log(`Language: ${language}, Difficulty: ${difficulty}`);
    if (!retry) {
      return;
    }

    if (counter === 0) {
      // Fail to find match modal
      return;
    }

    console.log(`Language: ${language}, Difficulty: ${difficulty}`);

    getMatch(user ? user.id : Math.random(), difficulty, language)
      .then((response) => {
        console.log(response);
        if (response.status) {
          setFinished(true);
          const sessionId = `${response.id}${response.partnerId}`;
          sessionStorage.setItem(sessionId, response.partnerId);
          setTimeout(() => {
            history.push(`/interview/${sessionId}`);
          }, 150);
        } else {
          setTimeout(() => {
            handleMatch(counter - 1, open);
          }, 5000);
        }
      })
      .catch((err) => console.log(err));
  };

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
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        onClick={() => {
          openModal(true);
          handleMatch(6, true);
        }}
      >
        Start coding!
      </Button>
    );
  };

  return (
    <div className="match-page">
      <p>{sessionText}</p>
      <DifficultyMenu />
      <LanguageMenu />
      <MatchButton />
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <LoadingButton loading={true} done={finished} />
          <Typography>Matching is in progress...</Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              openModal(false);
            }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default MatchPage;
