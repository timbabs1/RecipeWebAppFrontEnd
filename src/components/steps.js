import React from 'react';

import { Form, Input, Icon, Button, Alert } from 'antd';
import { InputNumber } from 'antd';

let id = 0;

class IngredientsForm extends React.Component {

  state = {
    confirmDirty: false,
    ingredientAddedSuccessfully: false, //if the user is added successfully
    showLogin: false, //if should we show a succesful feedback message after loggin in a user
    showError: false, //if should we show an error feedback message after logging in a user
    errorCode: 400, //to save the errorCode we received from the api server
    responseStatus: "warning",
    errorMessage: "", //the error message to display to the user after server rejects action
    username: this.props.username,
    password: this.props.password,
    recipeId: this.props.recipeId,
    categoryId: this.props.categoryId
  };
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, valuess) => {
      
      if (!err) {
        console.log(valuess)
        
        let list_of_steps = []
        let n = valuess.keys.length
        console.log(n)
        for (let i=0; i<n; i++) {
          console.log("Got into loop")
          
          let steps = {
            keys : valuess.keys[i],
            description : valuess.description[i],
            order : valuess.order[i],
            recipeId: this.props.recipeId
          }
          list_of_steps.push(steps)
          console.log(steps)
        }
        console.log(JSON.stringify(list_of_steps))

        fetch('http://localhost:3000/api/v1.0/steps',{
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + window.btoa(this.state.username + ':' + this.state.password),
          },
          body: JSON.stringify(list_of_steps)
          }).then(res => {
            if(res.ok){
                this.setState({ingredientAddedSuccessfully:true})
                return res.json()
            }else {
                console.log(res.status)
                this.setState({
                    ingredientAddedSuccessfully:false,
                    errorCode: res.status,
                    errorMessage: res.statusText 
                });
                return res.json()
            }
        }).then(data => this.checkResponse(data))
      }
    })
  };

  checkResponse = (data) => {

    if(this.state.ingredientAddedSuccessfully){
        //this.props.form.resetFields();
        this.setState({
            showSuccess:true,
            showError : false,
            responseStatus: "success",
            recipeId: data.recipeId,
            categoryId: data.categoryId
        });
        /* this.props.view({
          recipeId: this.state.recipeId,
          categoryId: this.state.categoryId
      }) */
    } else {
        //handle errors
        this.setState({
            errorMessage: data.message,
            showSuccess:false,
            showError:true,
            responseStatus:"error"
        });
    }
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? 'Description ' : ''}
        required={false}
        key={k}
        validateStatus={this.state.responseStatus}
      >
        {getFieldDecorator(`description[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input Ingredient name or delete this field.",
            },
          ],
        })(<Input placeholder="Step name" style={{ width: '60%', marginRight: 8 }} />)}
         {keys.length > 1 ? (
      <Icon
        className="dynamic-delete-button"
        type="minus-circle-o"
        onClick={() => this.remove(k)}
      />
    ) : null}
      </Form.Item> 
    ));

    const formItems2 = keys.map((i, index) => (
        <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? 'Order ' : ''}
            required={false}
            key={i}
            validateStatus={this.state.responseStatus}
            >
              {getFieldDecorator(`order[${i}]`, {
                //initialValue: '1',
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    message: "Please input order of step or delete this field.",
                  },
                ],
              })(<InputNumber placeholder="quantity" min={1} max={10} style={{ /* width:'40%', */ marginRight: 8 }} />)}
              {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(i)}
              />
              ) : null}
          </Form.Item>
        ))
    return (
      <Form onSubmit={this.handleSubmit}>
        {formItems}
        {formItems2}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> Add Step
          </Button>
        </Form.Item>
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        {this.state.showSuccess ? <Alert message="steps added successfully" type="success" /> :null}
        {this.state.showError ? <Alert message={"Error code " + this.state.errorCode + " " + this.state.errorMessage} type="error" /> :null}
      </Form>
    );
  }
}

const Ingredients = Form.create({ name: 'ingredients' })(IngredientsForm);
export default Ingredients;
//ReactDOM.render(<WrappedDynamicFieldSet />, mountNode);

/* const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(DynamicFieldSet);
ReactDOM.render(<WrappedDynamicFieldSet />, mountNode); */