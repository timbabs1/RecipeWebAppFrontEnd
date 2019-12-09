import React, { Component } from 'react';
import { List, Typography } from 'antd';

class RecipePreview extends Component {
    handleClick = () => {
        this.props.onClick(this.props.id);
    };
render() {
    return ( 
  <div>
    {/* <h3 style={{ marginBottom: 16 }}>Default Size</h3> */}
    <List
      header={<div>Ingredients</div>}
      bordered
      dataSource={'...'}
      renderItem={item => (
        <List.Item>
          <Typography.Text mark>[ITEM 3]</Typography.Text> {item}
        </List.Item>
      )}
    />
    <h3 style={{ margin: '16px 0' }}>Small Size</h3>
    <List
      size="small"
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={'...'}
      renderItem={item => <List.Item>{item}</List.Item>}
    />
    <h3 style={{ margin: '16px 0' }}>Large Size</h3>
    <List
      size="large"
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={'...'}
      renderItem={item => <List.Item>{item}</List.Item>}
    />
  </div>
);

      }
    }

export default RecipePreview;