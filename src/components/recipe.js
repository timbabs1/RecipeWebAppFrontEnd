import React from 'react';

import {
    message,
    Upload,
    Icon,
    Form,
    Input,
    Alert,
    Checkbox,
    Button,
    Select
} from 'antd';
import { relativeTimeThreshold } from 'moment';

const { Option } = Select;

class RecipeForm extends React.Component {

    async getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img)
      }
    state = {
        confirmDirty: false,
        recipeAddedSuccessfully: false, //if the user is added successfully
        showLogin: false, //if should we show a succesful feedback message after loggin in a user
        showError: false, //if should we show an error feedback message after logging in a user
        errorCode: 400, //to save the errorCode we received from the api server
        responseStatus: "warning",
        errorMessage: "", //the error message to display to the user after server rejects action
        username: this.props.username,
        password: this.props.password,
        recipeId: '',
        categoryId: '',
        profilePhoto: '',
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //echo the values to the browswer console to make sure they are correct
              
                Object.assign(values, {profilePhoto: this.state.imageUrl})
                console.log('Received values of form: ', values);
                if (!this.state.imageUrl.length < 0){
                    return  message.error("Number of Images must match number of steps with image 1 for step 1 ");
                  }

                //here we should send a request to our server
                //use fetch API to post the user data

                fetch('http://localhost:3000/api/v1.0/recipe',{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + window.btoa(this.state.username + ':' + this.state.password),
                    },
                    // body: JSON.stringify({values})
                }).then(res => {
                    if(res.ok){
                        this.setState({recipeAddedSuccessfully:true})
                        return res.json()
                    }else {
                        console.log(res.status)
                        this.setState({
                            recipeAddedSuccessfully:false,
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

        if(this.state.recipeAddedSuccessfully){
            this.props.form.resetFields();
            this.setState({
                showSuccess:true,
                showError : false,
                responseStatus: "success",
                recipeId: data.recipeId,
                categoryId: data.categoryId
            });
            this.props.view({
                recipeId: this.state.recipeId,
                categoryId: this.state.categoryId
            })
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
    beforeUpload(file) {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
            if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
            }
            return isJpgOrPng && isLt2M;
            }
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.getBase64(info.file.originFileObj, imageUrl => {
            this.setState({imageUrl})
            })
        }
        if (info.file.status === 'done'){
            this.getBase64(info.file.originFileObj, imageUrl => {
            this.setState({imageUrl})
            })
        
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        //this code will handle form responsiveness on small devices
        const formItemLayout = {
            labelCol: {
                xs: { span: 24},
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16},
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
        const config = {
            rules: [
              { type: "object", required: true, message: "Please select time!" }
            ]
        };
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
          const { imageUrl } = this.state;

        return (
            <div style={{ width: '50%', textAlign: 'center', margin: 'auto' }}>
            <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
            >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '50%', margin: 'auto' }} /> : uploadButton}
            </Upload>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="Title" hasFeedback validateStatus={this.state.responseStatus}>
                    {getFieldDecorator('title', {
                        rules: [
                             {
                                required: true,
                                message: 'Please input your title',
                            },
                        ],
                    })(<Input onChange={this.handleEmail} />)}
                </Form.Item>
                <Form.Item label="Subtitle" hasFeedback  validateStatus={this.state.responseStatus}>
                    {getFieldDecorator('subtitle', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your subtitle',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="Description" hasFeedback  validateStatus={this.state.responseStatus}>
                    {getFieldDecorator('description', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your description',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="CategoryId" hasFeedback>
                    {getFieldDecorator('categoryId', {
                        rules: [{ required: true, message: "Please select your recipe's category!" }],
                    })(
                        <Select placeholder="Please select a category">
                        <Option value="Breakfast">Breakfast</Option>
                        <Option value="Lunch">Lunch</Option>
                        <Option value="Beverages">Beverages</Option>
                        <Option value="Appetizers">Appertizers</Option>
                        <Option value="Soups">Soups</Option>
                        <Option value="Salads">Salads</Option>
                        <Option value="Desserts">Desserts</Option>
                        </Select>,
                    )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
                {this.state.showSuccess ? <Alert message="recipe was added successfully" type="success" /> :null}
                {this.state.showError ? <Alert message={"Error code " + this.state.errorCode + " " + this.state.errorMessage} type="error" /> :null}
            </Form>
            </div>
        );
    }
}

const Recipe = Form.create({ name: 'recipe' })(RecipeForm);

export default Recipe;