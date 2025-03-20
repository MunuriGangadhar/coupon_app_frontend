import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import './App.css'; // Import CSS

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={UserPage} />
        <Route path="/admin" component={AdminPage} />
      </Switch>
    </Router>
  );
}

export default App;