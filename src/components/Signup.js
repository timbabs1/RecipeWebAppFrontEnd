import React from 'react';
// import './App.css';
import { Link } from 'react-router-dom';
import {
  Form,
  Input,
  Alert,
  Checkbox,
  Button
} from 'antd';

class RegistrationForm extends React.Component {
  
  state = {
    confirmDirty: false,
    addedSucessfully: false, //if the user is added successfully
    showSuccess: false, //if should we show a successful feedback message after adding a user
    showError: false, //if should we show an error feedback message after adding a user
    errorCode: 400,  //to save the errorCode we recieved from the api server
    responseStatus: "nothing",  //the validation status of the email
    errorMessage: ""   //the error message to display to the user after server rejects action
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //echo the values to the browser console to make sure they are correct
        console.log('Received values of form: ', values);

        //here we should send a request to our server to post the user

        //use fetch API to post the user data
        fetch('http://localhost:3000/api/v1.0/users', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({values})
        }).then(res => {
          if(res.ok)
            this.setState({addedSucessfully:true})
          else
            this.setState({
              addedSucessfully:false,
              errorCode: res.status
            });

            return res.json()
        }).then(data => this.checkResponse(data))
      }
    });
  };

  handleEmail = ()=> {
    this.setState({responseStatus:"nothing"})
  }

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  checkResponse = (data) => {

    if(this.state.addedSucessfully){
      this.props.form.resetFields();
      this.setState({
        showSuccess:true,
        showError : false
      });
    }
    else{
      //handle errors
      this.setState({
        errorMessage: data.message,
        showSuccess:false,
        showError : true, 
        responseStatus: "error"
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    //this code will handle form responsivness on small devices
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    
    //prefix the email input with some decoration 
    const prefixEmail = getFieldDecorator('email')(
      <h4>@</h4>,
    );

    return (
      
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="E-mail" hasFeedback validateStatus={this.state.responseStatus} help={this.state.errorMessage}>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input addonBefore={prefixEmail} onChange={this.handleEmail} />)}
        </Form.Item>
        <Form.Item label="Password" hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                min: 6,
                message: 'password should be at least 6 characters long!',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback>
          {getFieldDecorator('passwordConfirmation', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={this.handleConfirmBlur} />)}
          
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
          })(
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>,
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
        {this.state.showSuccess ? <Alert message="account created successfully" type="success" /> :null}
        {this.state.showError ? <Alert message={this.state.errorMessage} type="error" /> :null}
      </Form>
    );
  }
}

const Signup = Form.create({ name: 'register' })(RegistrationForm);

export default Signup;