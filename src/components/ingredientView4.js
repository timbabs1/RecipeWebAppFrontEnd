import React from 'react';
//import './Card.css';
//import './tooltip.css';
// import FontAwesome from 'react-fontawesome';
import { Card, Col, Row} from 'antd'

import { Form, Input, Icon, Button, Alert, Modal } from 'antd';
import { InputNumber } from 'antd';
import { ANT_MARK } from 'antd/lib/locale-provider';
import { thisExpression } from '@babel/types';
import IngredientCard from './ingredientCard'

let id = 0;
const { Meta } = Card;

class IngredientView4 extends React.Component {
  
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
           visible: false
        };
        
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onBookmarkClicked = this.onBookmarkClicked.bind(this);
    }
     showModal = () => {
        this.setState({
          visible: true,
        });
      };
      handleCancel = () => {
        this.setState({ visible: false });
      };

      handleOk = e => {
        console.log(e);
        this.setState({
          visible: false,
        });
      };

    componentDidMount(){
        let recipeId = this.props.recipeId
        let URL = new Request (`http://localhost:3000/api/v1.0/ingredient/${recipeId}`)
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

    onClickHandler(event){

        event.preventDefault();
        this.props.onClick(this.props.id);
    }
    onBookmarkClicked(event){

        let currentValue = this.state.bookmarked;
        this.setState({bookmarked:!currentValue});
    }

        ingredientCard(){
            const children = []
            for (let i = 0; i < this.state.items.length; i++) {
                let item = Object.assign({}, this.state.items[i]);
                console.log(item)
                
              children.push(
                <Col key={item.ID} span={8}>
                <IngredientCard  
                Id = {item.ID}
                type="inner" 
                title={item.title} 
                categoryId= {item.categoryId} 
                description={item.description}
                quantity={item.quantity}
                username = {this.props.username}
                password = {this.props.password} 
                mainImageURL = {item.mainImageURL} /></Col>
                  
              )}
            return children
            }

    render() {
        
    return (
        <Card title="Ingredients">
        <div style={{ background: '#ECECEC', padding: '30px' }}>
                    <Row gutter={16}>

        
            {this.ingredientCard()}
            </Row>
            </div>
            </Card>
        );
    }
}

const Ingredients4 = Form.create({ name: 'Ingredients4' })(IngredientView4);

export default Ingredients4;