import 'react-toastify/dist/ReactToastify.css';
import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import InterviewPage from './pages/InterviewPage';
import { UserContext } from './context/UserContext';
import { chatPing } from './services/chat';
import { matchPing } from './services/match';
import { accountPing } from './services/profile';
import { interviewPing } from './services/interview';
import { HeaderBar } from './components/HeaderBar';

const App = () => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    chatPing()
      .then(() => console.log('Chat service is up'))
      .catch(() => toast.error('Cannot connect to chat service'));
    matchPing()
      .then(() => console.log('Match service is up'))
      .catch(() => toast.error('Cannot connect to match service'));
    accountPing()
      .then(() => console.log('Account service is up'))
      .catch(() => toast.error('Cannot connect to account service'));
    interviewPing()
      .then(() => console.log('Interview service is up'))
      .catch(() => toast.error('Cannot connect to interview service'));

    // login test account
    // login('seeder@email.com', 'password');
  }, []);

  return (
    <BrowserRouter>
      <HeaderBar />
      <ToastContainer position="top-right" />
      <Switch>
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/login" component={LandingPage} />
        <Route exact path="/interview" component={InterviewPage} />
        <Route>
          {user ? (
            <Redirect to={{ pathname: '/home' }} />
          ) : (
            <Redirect to={{ pathname: '/login' }} />
          )}
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
