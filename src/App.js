import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import logo from './logo.svg';
import Signup from './components/Signup';
import Login from './components/Login';
import Hello from './components/Hello';
import './App.css';
// import './components/css/login.css';

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      currentView : 'login',
      isLoggedin: false
    }
  }

  changeView(){
    this.setState({
      currentView: 'home',
      isLoggedin: true
    })
  }

  render() {
    let whatToRender;

    if(this.state.currentView === 'home'){
      whatToRender= <Hello  name=" Babz" />  
      //TODO
    }
    else if(this.state.currentView === "login"){
      whatToRender = <Login view={this.changeView.bind(this)}/> 
    }

    else if(this.state.currentView === "hello"){
      whatToRender = <Hello name='Babz'/>
    }
    else if(this.state.currentView === "signup"){
      whatToRender = <Signup view={this.changeView.bind(this)} />
    }
    return (
      <Router>    
      <div style={{align: "right", padding: '20px' }}>
      <NavLink  to="/login" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Login</NavLink>
                <NavLink exact to="/signup" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign Up</NavLink>
    </div>

    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />

    

{/* <div className="PageSwitcher">
                <NavLink to="/login" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Login</NavLink>
                <NavLink exact to="/signup" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign Up</NavLink>
      {/* {whatToRender} */}
    {/* </div> */}

    </Router>
    );   
    }
  }   

  export default App;
