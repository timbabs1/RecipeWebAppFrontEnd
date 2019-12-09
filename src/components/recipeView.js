import React from 'react';
//import './Card.css';
//import './tooltip.css';
import FontAwesome from 'react-fontawesome';
import { Card, Col, Row} from 'antd'

import { Form, Input, Icon, Button, Alert, Pagination } from 'antd';
import { InputNumber } from 'antd';
import { ANT_MARK } from 'antd/lib/locale-provider';
import RecipeCard from './recipeCard';

let id = 0;
const { Meta } = Card;

const gridStyle = {
    width: '25%',
    textAlign: 'center',
  };
class RecipeView1 extends React.Component {
    
    constructor(props){
        super(props);

        this.state = {
           cardStyle:{backgroundColor:this.props.backgroundColor},
           bookmarked: false,
           loadedSuccessfully : false,
           username : this.props.username,
           password : this.props.password,
           items : this.props.items,
           expand : false,
           minValue: 0,
           maxValue: 8
        };
        
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onBookmarkClicked = this.onBookmarkClicked.bind(this);
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
                        authorId = {item.authorId}
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
            <Card title="Recipes">
            
            <div style={{ background: '#ECECEC', padding: '30px' }}>
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

const RecipeView = Form.create({ name: 'RecipeView' })(RecipeView1);

export default RecipeView;