import React from 'react';
//import './Card.css';
//import './tooltip.css';
import FontAwesome from 'react-fontawesome';
import { Card, Col, Row} from 'antd'

import { Select, Form, Input, Icon, Button, Alert, Pagination } from 'antd';
import { InputNumber } from 'antd';
import { ANT_MARK } from 'antd/lib/locale-provider';
import RecipeCard from './recipeCard';

let id = 0;
const { Meta } = Card;

const gridStyle = {
    width: '25%',
    textAlign: 'center',
  };

  const { Option } = Select
class Viewcategory extends React.Component {
    
    constructor(props){
        super(props);

        this.state = {
           cardStyle:{backgroundColor:this.props.backgroundColor},
           bookmarked: false,
           loadedSuccessfully : false,
           username : this.props.username,
           password : this.props.password,
           items : [],
           expand : false,
           minValue: 0,
           maxValue: 8,
           category: ''
        };
        
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onBookmarkClicked = this.onBookmarkClicked.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleChange1 = this.handleChange1.bind(this);
    }

    componentDidMount(){
        let limit = 300
        let categoryId = 1
        let URL = new Request (`http://localhost:3000/api/v1.0/recipe/category/?category=${categoryId}`)
        fetch(URL,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + window.btoa(this.props.username + ':' + this.props.password),
            },
        }).then(res => res.json())
        .then(
            (result) => {
                console.log(result)
            this.setState({
                isLoaded: true,
                items: result
            });
            },
            (error) => {
            this.setState({
                isLoaded: false,
                error
            });
            }
        )
    }
    handleChange2(){
        let category = this.state.category
        let categoryId = 2
        if (this.state.category === 'Breakfast'){
                categoryId = 1
            } else if (this.state.category === 'lunch'){
                categoryId = 2
            } else if (this.state.category === 'Beverages'){
                categoryId = 3
            } else if (this.state.category === 'Appetizers'){
                categoryId = 4
            } else if (this.state.category === 'Soups'){
                categoryId = 5
            } else if (this.state.category === 'Salads'){
                categoryId = 6
            } else if (this.state.category === 'Desserts'){
                categoryId = 7
            } 
        let URL = new Request (`http://localhost:3000/api/v1.0/recipe/category?category=${categoryId}`)
        fetch(URL,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + window.btoa(this.props.username + ':' + this.props.password),
            },
        }).then(res => res.json())
        .then(
            (result) => {
                console.log(result)
            this.setState({
                isLoaded: true,
                items: result
            });
            },
            (error) => {
            this.setState({
                isLoaded: false,
                error
            });
            }
        )
    }

    handleChange1(value){
        this.setState({category: value})
        this.handleChange2()
    }
    

    onClickHandler(Id){
        this.props.onClick(Id);
        console.log(Id)
    }
    onBookmarkClicked(event){

        let currentValue = this.state.bookmarked;
        this.setState({bookmarked:!currentValue});
    }


handleChange = value => {
    if (value <= 1) {
      this.setState({
        minValue: 0,
        maxValue: 8
      });
    } else {
      this.setState({
        minValue: this.state.maxValue,
        maxValue: value * 8
      });
    }
  };
            ingredientCard(){
                const children = []
        
                this.state.items &&
                    this.state.items.length > 0 &&
                    this.state.items.slice(this.state.minValue, this.state.maxValue).map(item => {
                    children.push(
                        
                        
                        <Col key={item.ID} span={6}>
                        <RecipeCard  
                        Id = {item.ID}
                        type="inner" 
                        title={item.title}
                        mainImageURL = {item.mainImageURL} 
                        categoryId= {item.categoryId} 
                        subtitle={item.subtitle}
                        onClick={this.onClickHandler}
                        username = {this.props.username}
                        password = {this.props.password}/></Col>
                       
                )})
                
                return children
                }
                

    render() {
        console.log(this.ingredientCard())
    return (
        <div>
            <Select placeholder="Please select a category" onChange={this.handleChange1} defaultValue="Breakfast" style={{ width: 200 }}  >
                        <Option value="Breakfast">Breakfast</Option> 
                        <Option value="Lunch">Lunch</Option>
                        <Option value="Beverages">Beverages</Option>
                        <Option value="Appetizers">Appertizers</Option>
                        <Option value="Soups">Soups</Option>
                        <Option value="Salads">Salads</Option>
                        <Option value="Desserts">Desserts</Option>
                        </Select>
            <Card title="Recipes">
            
            <div style={{ background: '#ECECEC', padding: '30px'}}>
            <Row gutter={16}>
            {this.ingredientCard()}
            </Row>
            </div>
            
            </Card>
            <Pagination
            defaultCurrent={1}
            defaultPageSize={8}
            onChange={this.handleChange}
            total={300}
            />
            </div>
    
        );
    }
}

/* const RecipeView = Form.create({ name: 'RecipeView' })(RecipeView1); */

export default Viewcategory;