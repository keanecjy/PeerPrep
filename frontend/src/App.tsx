import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import InterviewPage from './pages/InterviewPage';
import { UserContext } from './context/UserContext';
import { chatPing } from './services/chat';
import { matchPing } from './services/match';
import { accountPing } from './services/profile';
import { interviewPing } from './services/interview';
import { login } from './services/auth';

const App = () => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    chatPing().then(() => console.log('Chat service is up'));
    matchPing().then(() => console.log('Match service is up'));
    accountPing().then(() => console.log('Account service is up'));
    interviewPing().then(() => console.log('Interview service is up'));

    // login test account
    login('seeder@email.com', 'seeder');
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/interview" component={InterviewPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
