import React from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import InterviewPage from './pages/InterviewPage';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/interview" component={InterviewPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
