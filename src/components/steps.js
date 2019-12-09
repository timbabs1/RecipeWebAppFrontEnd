import React from 'react';

import { Upload, message, Form, Input, Icon, Button, Alert } from 'antd';
import { InputNumber } from 'antd';

let id = 0;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class StepsForm extends React.Component {

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
    categoryId: this.props.categoryId,
    imageUrls: []
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
        Object.assign(valuess, {stepImage: this.state.imageUrls})
        console.log(this.state.imageUrl)
        console.log(valuess)
        
        let list_of_steps = []
        let n = valuess.keys.length
        console.log(n)
        console.log(this.state.imageUrls)
        for (let i=0; i<n; i++) {
          console.log("Got into loop")
          
          let steps = {
            keys : valuess.keys[i],
            description : valuess.description[i],
            order : valuess.order[i],
            recipeId: this.props.recipeId,
            imageUrl : valuess.stepImage[i],
          }
          list_of_steps.push(steps)
        }
        if (this.state.imageUrls.length !== list_of_steps.length){
          return  message.error("Number of Images must match number of steps with image 1 for step 1 ");
        }
        let filtered_list_of_steps = list_of_steps.filter(value => value.description !== undefined)
        console.log(JSON.stringify(filtered_list_of_steps))
        console.log(filtered_list_of_steps)

        fetch('http://localhost:3000/api/v1.0/steps',{
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + window.btoa(this.state.username + ':' + this.state.password),
          },
          body: JSON.stringify(filtered_list_of_steps)
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
        
        this.props.view({
          recipeId: this.state.recipeId,
          username: this.props.username,
          password: this.props.password
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
  handleChange = async info => {
    let get60arr = []
    for (const i in info.fileList){
     console.log(info.fileList[i])
      let get60 = await getBase64(info.fileList[i].originFileObj)
      get60arr.push(get60)
      console.log(get60)
      console.log(get60arr)
    }
    this.setState({
      imageUrls: get60arr
    }) 
  }
  /* handleChange2 = async info => {
    if (info.file.status === 'uploading'){
      let get60 = await getBase64(info.file.originFileObj)
      this.setState({
        imageUrl: get60
      })
    }
    if (info.file.status === 'done'){
      let get60 = await getBase64(info.file.originFileObj)
      this.setState({
        imageUrl: get60
      })
    }
} */

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl, imageUrls } = this.state; 
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
      <div key={k}>
      <Form.Item
        {...formItemLayout}
        label={'Description: '}
        required={true}
        
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
      <Form.Item
            {...formItemLayout}
            label={'Order: '}
            required={true}
            validateStatus={this.state.responseStatus}
            >
              {getFieldDecorator(`order[${k}]`, {
                //initialValue: '1',
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    message: "Please input order of step or delete this field.",
                  },
                ],
              })(<InputNumber placeholder="quantity" min={1} max={10} style={{ /* width:'40%', */ marginRight: 8 }} />)}
          </Form.Item>
    </div>
    ));
    return (
      <div style={{ width: '50%', textAlign: 'center', margin: 'auto' }}>
      {/* <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      beforeUpload={this.beforeUpload}
      onChange={this.handleChange2}
      >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload> */}
      <h1>Main Image Upload: Please note number of Images must match number of steps and the Max Allowed is 8</h1>
      <h2>Or else steps will not be inserted into database</h2>
      <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      /* showUploadList={false}  */
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      beforeUpload={this.beforeUpload}
      onChange={this.handleChange}
      >
      {imageUrls.length >= 8 ? null : uploadButton}
      </Upload>
      <Form onSubmit={this.handleSubmit}>
        {formItems}
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
      </div>
    );
  }
}

const Steps = Form.create({ name: 'steps' })(StepsForm);
export default Steps;