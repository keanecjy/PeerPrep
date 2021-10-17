import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

const HomePage = () => {
  const { user } = useContext(UserContext);
  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div>
      <h1>This page will contain the HomePage.</h1>
      <p>
        Logged in as: {user?.firstName} {user?.lastName}
      </p>
    </div>
  );
};

export default HomePage;
