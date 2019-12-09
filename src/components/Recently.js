import React from "react";
//  import "./style.css";
// import Popup from "./popup";
// import axios from 'axios';
import { object } from "prop-types";
import { Result } from "antd";



class Recently extends React.Component {

        constructor(props) {
        super(props);
        this.state = {
          username: this.props.username,
          password: this.props.password,
          items: [],
        }
      };

      componentDidMount(){

        fetch('http://localhost:3000/api/v1.0/recent/sweet',{
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + window.btoa(this.state.username + ':' + this.state.password),
            },

        }).then(res => res.json())
        .then(result => {
            const items = []
            for (let i = 0; i < this.state.items.length; i++) {
                let item = Object.assign({}, this.state.items[i]);
                console.log(item)
            }
            this.setState({
          items: result
            });
        
        })
    }

    
                  

    render() {
return (
    // <div><h3>{this.state.item.id}</h3></div>,
    <ul>
         {this.state.items.map(function(item, index) {
             return <h1>{item.title}</h1>
         })}
    </ul>
)


        }
    }
 
 
 export default Recently