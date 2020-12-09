import React from 'react';
import './App.css';
import {Switch, Route} from 'react-router-dom';
import {LandingPage, GuildsPage, DashboardPage} from './pages';

function App() {
  return (
    <Switch>
      <Route path="/" exact={true} component={LandingPage} />
      <Route path="/guilds" exact={true} component={GuildsPage} />
      <Route path="/dashboard" exact={true} component={DashboardPage} />
    </Switch>
  );
}

export default App;
