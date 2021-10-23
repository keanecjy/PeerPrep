import { Button } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { UserContext } from '../context/UserContext';

const HomePage = () => {
  const { user } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div>
      <h1>This page will contain the HomePage.</h1>
      <p>Logged in as: {user?.name}</p>
      <Button onClick={() => history.push('interview')}>Go to Interview</Button>
    </div>
  );
};

export default HomePage;
