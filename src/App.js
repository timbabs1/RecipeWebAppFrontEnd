import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import Signup from './components/Signup';
import Login from './components/Login';
import Hello from './components/Hello';
import Recipe from './components/Recipe';
import Ingredients from './components/Ingredients';
import Steps from './components/Steps'
import ReceipePreview from './components/RecipePreview'
import './App.css';
import { thisExpression } from '@babel/types';
import RecipePreview from './components/RecipePreview';
import Search from './components/search';
import Recently from './components/Recently';
import DbSearch from './components/search/DbSearch';

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      currentView : 'login',
      isLoggedin: false,
      username: '',
      password:'',
      recipeId:'',
      categoryId: ''
    }
  }

  changeView(userdata){
    this.setState({
      currentView: 'home',
      isLoggedin: true,
      username: userdata.username,
      password: userdata.password
    })
  }

  changeView2(data){
    this.setState({
      currentView: 'ingredients',
      isLoggedin: true,
      recipeId: data.recipeId,
      categoryId: data.categoryId
    })
    
  }

  changeView3(data){
    this.setState({
      currentView: 'steps',
      isLoggedin: true,
      recipeId: data.recipeId,
      categoryId: data.categoryId
    })
    
  }

  changeView4(data){
    this.setState({
      currentView: 'home',
      isLoggedin: true,
      recipeId: data.recipeId,
    })
    
  }

  /* changeView2(data){
    this.setState({
      currentView: 'steps',
      isLoggedin: true,
      recipeId: data.recipeId,
      categoryId: data.categoryId
    })
  } */

  render() {
    let whatToRender;

    if(this.state.currentView === 'home'){
      whatToRender= <div>
        {/* <Recently username={this.state.username} password={this.state.password}/> */}
        {/* <Search username={this.state.username} password={this.state.password}/> */}
        <DbSearch username={this.state.username} password={this.state.password}/>
                      {/* <Hello name=" Babz" />  */}
                      {/* <Recipe view={this.changeView2.bind(this)} username={this.state.username} password={this.state.password}/>  */}
                      {/* <Login view={this.changeView.bind(this)}/> */}
                    </div>
      //TODO
    }

    else if(this.state.currentView === "ingredients"){
      whatToRender = <Ingredients view={this.changeView3.bind(this)} categoryId={this.state.categoryId} recipeId={this.state.recipeId} username={this.state.username} password={this.state.password}/>
    }

    else if(this.state.currentView === "steps"){
      whatToRender = <Steps view={this.changeView4.bind(this)} recipeId={this.state.recipeId} username={this.state.username} password={this.state.password}/>
    }

    else if(this.state.currentView === "search"){
      whatToRender = <Steps view={this.changeView4.bind(this)} username={this.state.username} password={this.state.password}/>
    }

    else if(this.state.currentView === "recently"){
      whatToRender = <Steps view={this.changeView4.bind(this)} username={this.state.username} password={this.state.password}/>
    }

    else if(this.state.currentView === "login"){
      whatToRender = 
      <div>
      <Router>
          <div className="PageSwitcher">
          <NavLink to="/login" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Login</NavLink>
          <NavLink exact to="/signup" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign Up</NavLink>
          </div>   
          <div>
          <Route path="/login" render={props => (<Login {...props} view={this.changeView.bind(this)}/>)}/>
          <Route path="/Signup" render={props => (<Signup {...props} view={this.changeView.bind(this)}/>)}/>
          <Redirect exact from="/" to="/login" />
          </div>
       </Router>
      </div> 
    }

    else if(this.state.currentView === "hello"){
      whatToRender = <Hello name='Babz'/>
     }
     else if(this.state.currentView === "signup"){
      whatToRender = <Signup view={this.changeView.bind(this)} />
    }
    return (

    <div>
      {whatToRender}
      {/* <RecipePreview /> */}
      {/* <Search /> */}
      {/* <Recently /> */}
      {/* {<DbSearch />} */}


    </div>
    );   
    }
  }   

  export default App;
