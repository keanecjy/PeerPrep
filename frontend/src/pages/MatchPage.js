import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { difficulties, languages, sessionText } from '../match/constants';
import LoadingButton from '../match/LoadingButton';
import SelectionMenu from '../match/SelectionMenu';
import { getMatch } from '../services/match';
import '../styles/match.css';

const MatchPage = () => {
  const user = useContext(UserContext);

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
    <div className="match-page">
      <p>{sessionText}</p>
      <DifficultyMenu />
      <LanguageMenu />
      <MatchButton />
    </div>
  );
};

export default MatchPage;
