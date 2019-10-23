import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';


function App() {

  return (
    <Router>
    <div style={{ background: '#ECECEC', padding: '30px' }}>
      
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    </div>

<div className="PageSwitcher">
                <NavLink to="/login" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Login</NavLink>
                <NavLink exact to="/signup" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign Up</NavLink>
              </div>

    
    </Router>
  );
}

export default App;
