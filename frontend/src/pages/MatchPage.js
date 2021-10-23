import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { getMatch } from '../services/match';
import { UserContext } from '../context/UserContext';
import LoadingButton from '../match/LoadingButton';
import SelectionMenu from '../match/SelectionMenu';

const sessionText = `
To begin a session, choose your preferred difficult and programming language. If someone in the queue has selected the same option as you, you will be matched with him. Otherwise, we will attempt to match you with someone of the same difficulty after 25s. You will be timed out after 30s if there is no matches. Happy coding!
`;

const user = useContext(UserContext);

const difficulties = ['Easy', 'Medium', 'Hard'];
const languages = ['Java', 'JavaScript', 'Python'];

const MatchPage = () => {
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleMatch = () => {
    getMatch(user.id, difficulty, language).then((res) => {
      if (res.status != 200) {
        console.error('Error with getMatch call');
      }

      const data = res.data;
      console.log(data);
      if (data.status) {
        setFinished(true);
        // Create session and route to session page
      } else {
        setLoading(false);
        // Show modal saying unable to find match
      }
    });
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
      <LoadingButton
        loading={loading}
        done={finished}
        onClick={() => {
          setLoading(true);
          handleMatch();
        }}
      >
        Start coding!
      </LoadingButton>
    );
  };

  return (
    <div>
      <Text>{sessionText}</Text>
      <DifficultyMenu />
      <LanguageMenu />
      <MatchButton />
    </div>
  );
};

export default MatchPage;
