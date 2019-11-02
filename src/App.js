import React from 'react';
import logo from './logo.svg';
import Signup from './components/Signup';
import Login from './components/Login';
import Hello from './components/Hello';
import './App.css';

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

    <div style={{ background: '#ECECEC', padding: '30px' }}>
      {whatToRender}
    </div>
    );   
    }
  }   

  export default App;
