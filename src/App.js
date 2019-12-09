import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import Signup from './components/Signup';
import Login from './components/Login';
import Recipe from './components/recipe';
import Ingredients from './components/ingredients';
import Steps from './components/steps';
import CallAPI from './CallAPI';
import './App.css';
import { thisExpression } from '@babel/types';
import RecipeView from './components/recipeView';
import RecipeView2 from './components/recipeView2';
import Header from './components/header';
import Viewcategory from './components/viewByCategory'

class App extends React.Component {
  api = new CallAPI();
  constructor(props){
    super(props);

    this.state = {
      currentView : 'login',
      isLoggedin: false,
      username: '',
      password:'',
      recipeId:'',
      categoryId: '',
      items : [],
      homeItems: [],
      currentRecipe: null,
      clicked : false
    }
    this.updateRecipeData = this.updateRecipeData.bind(this);
    this.handleThumbnailClicked = this.handleThumbnailClicked.bind(this);
    this.showHome = this.showHome.bind(this);
  }

   //we will pass this function to card component so we will handle which thumbnail was clicked
   handleThumbnailClicked(key){
        
    //ignore if we are showing something else otherthan the grid of thumbnails 
    /* if(this.state.currentView !== "home")
    return; */
    
    let len = this.state.items.length;
    console.log(key)

    
    //iterate through the items and find the one matching the clicked id
    for(let i = 0; i < len ; i++){

    if(this.state.items[i].ID === key){

      console.log(this.state.items[i].ID)
      console.log(key)
        
        let item = Object.assign({}, this.state.items[i]);
        console.log(item)

        this.setState({
        currentView: "recipe1",
        currentRecipe: item,
        recipeId: this.state.items[i].ID,
        clicked : true
        });
    }
    }
}

  updateRecipeData(err, data){

    if(err){
        return;
    }
    //when displaying home screen we need to show only portion of the body
    //so we create a new data and map the new items to exactly the same 
    //however we extract just a portion of the original body and use this array
    //to display home thumbnails
    let data2 = data.map( item => {

      let shortBody = item.subtitle.substring(0, 128);

      return {
        id: item.ID,
        title: item.title,
        authorId : item.authorId,
        subtitle: shortBody,
        createdDate: item.DateCreated,
        photo: item.mainImageURL
      }
    })
      this.setState({
        items : data,
        homeItems: data2
      }) 
      console.log(data)
      this.showHome();
    }

showHome(){
  //in case we were showing an recipe, remove it from the state
  if(this.state.currentRecipe !== null)
    this.setState({currentRecipe: null});
  
  this.setState({currentView:"recipeHome"});
}

showRecipe(){
  this.setState({currentView:"recipeCreate"})
}

showCategory(){
  this.setState({currentView:"viewcategory"})
}

  changeView(userdata){
    this.setState({
      isLoggedin: true,
      username: userdata.username,
      password: userdata.password
    })
    this.api.getRecipe(userdata, this.updateRecipeData);
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

  changeView4(userdata){
    this.setState({
      currentView: 'recipeHome',
      isLoggedin: true,
      recipeId: userdata.recipeId,
    })
    this.api.getRecipe(userdata, this.updateRecipeData);
  }

  render() {
    let whatToRender;

    if(this.state.currentView === 'recipeHome'){
      whatToRender= <div> 
                      <RecipeView items={this.state.items} colClass={6} username={this.state.username} password={this.state.password} onClick={this.handleThumbnailClicked} />
                    </div>
    }

    else if(this.state.currentView === "ingredients"){
      whatToRender = <Ingredients view={this.changeView3.bind(this)} categoryId={this.state.categoryId} recipeId={this.state.recipeId} username={this.state.username} password={this.state.password}/>
    }

    else if(this.state.currentView === "steps"){
      whatToRender = <Steps view={this.changeView4.bind(this)} recipeId={this.state.recipeId} username={this.state.username} password={this.state.password}/>
    }

    else if(this.state.currentView === "recipe1"){
      let tempArr = [this.state.currentRecipe]
      whatToRender = <RecipeView2 clicked={this.state.clicked} colClass={6} rowLength={1} recipeId={this.state.recipeId} items={tempArr} username={this.state.username} password={this.state.password} colClass="col-m-6" rowLength={1} onClick={this.handleThumbnailClicked}/>
    }

    else if(this.state.currentView === "recipeCreate"){
      whatToRender = <Recipe view={this.changeView2.bind(this)} changeview={this.showRecipe.bind(this)} username={this.state.username} password={this.state.password}/>
    }

    else if(this.state.currentView === "viewcategory"){
      whatToRender = <Viewcategory onClick={this.handleThumbnailClicked} changeview={this.showRecipe.bind(this)} username={this.state.username} password={this.state.password}/>
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
    return (

    <div>
      <Header title="RecipeHome" onClickTitle={this.showHome.bind(this)} viewRecipeCategory={this.showCategory.bind(this)} showRecipe1={this.showRecipe.bind(this)} />
      {whatToRender}
    </div>
    );   
    }
  }   

  export default App;
