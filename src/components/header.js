import React, { Component } from 'react';
import './Header.css';
import FontAwesome from 'react-fontawesome';
import { Button } from 'antd'

import logo from './img/recipe.jpg';

class Header extends Component {
  
    constructor(props){
        super(props);

        this.state = {
            searchTerm : "",
            headerStyle:{backgroundColor:this.props.backgroundColor}
        }
        this.handleTitleClick = this.handleTitleClick.bind(this);
        this.handleCreateRecipe = this.handleCreateRecipe.bind(this);
        this.handleViewByCategory = this.handleViewByCategory.bind(this);
    }
    handleTitleClick(event){

        if(this.props.onClickTitle != null){
            this.props.onClickTitle();
        }
            
    }
    handleCreateRecipe(){
        this.props.showRecipe1();
    }
    handleViewByCategory(){
        this.props.viewRecipeCategory()
    }
  
    render() {

        return (

            //this is JSX code which is very similar to HTML we already know
            <div className="header" style={this.state.headerStyle}>
                <img src={logo} alt="React logo"  /><a href="#default" className="logo" onClick={this.handleTitleClick} > {this.props.title}</a>
                <div className="header-right">
                <Button type="primary" onClick={this.handleCreateRecipe} style={{ marginBottom: 20 }}> click here to create new recipe </Button> <br></br>
                <Button type="primary" onClick={this.handleViewByCategory}> click here to view all recipe of your chosen category </Button>
                </div>
            </div>
        );
    }
}
export default Header;