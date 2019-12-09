import React from 'react';
//import './Card.css';
//import './tooltip.css';
// import FontAwesome from 'react-fontawesome';
import { Card, Col, Row} from 'antd'

import { Upload, message, Popconfirm, Form, Input, Icon, Button, Alert, Pagination, Modal, Select } from 'antd';
import { InputNumber } from 'antd';
import { ANT_MARK } from 'antd/lib/locale-provider';

let id = 0;
const { Meta } = Card;

const gridStyle = {
    width: '25%',
    textAlign: 'center',
  };
  const text = 'Are you sure to delete this recipe?';
const { Option } = Select;
  class RecipeDeck extends React.Component {
    async getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img)
    }
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.state = {
          visible: false,
          disabled: true,
          recipeUpdatedSuccessfully: false,
          recipeDeletedSuccessfully: false,
          showSuccess: false,
          showDeleteSuccess: false,
          text: "Enable Edit Mode",
          loading: false,
          profilePhoto: '',
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleClick(){
        this.props.onClick(this.props.Id);
    }
    showModal = () => {
      this.setState({
        visible: true,
      });
    };

    handleOk = e => {
      console.log(e);
      this.setState({
        visible: false,
      });
    };
    handleCancel = () => {
      this.setState({ visible: false });
    };

    handleGameClik() {
      this.setState( {disabled: !this.state.disabled} )
      if (this.state.disabled === false){
          this.state.text = "Enable Edit Mode"
      } else {
          this.state.text = "Disable Edit Mode"
      }
    };

    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
          if (!err){
              let recipeId=  this.props.Id
              
              Object.assign(values, {recipePhoto: this.state.imageUrl})
              if (!this.state.imageUrl){
                return  message.error("You must have an image");
              }
            fetch(`http://localhost:3000/api/v1.0/recipe/${recipeId}`,{
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + window.btoa(this.props.username + ':' + this.props.password),
                },
                body: JSON.stringify({values})
            }).then(res => {
                if(res.ok){
                    this.setState({recipeUpdatedSuccessfully:true})
                    this.setState({showSuccess:true})
                    return res.json()
                }else {
                    console.log(res.status)
                    this.setState({
                        recipeUpdatedSuccessfully:false,
                        errorCode: res.status,
                        errorMessage: res.statusText,
                        showSuccess: false 
                    });
                    return res.json()
                }
                })
          }
      })
    }

    handleDelete() {
      let recipeId = this.props.Id
      console.log(recipeId)
      fetch(`http://localhost:3000/api/v1.0/recipe/${recipeId}`,{
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + window.btoa(this.props.username + ':' + this.props.password),
                }
    }).then(res => {
        if(res.ok){
            this.setState({recipeDeletedSuccessfully:true})
            this.setState({showDeleteSuccess:true})
            return res.json()
        }else {
            console.log(res.status)
            this.setState({
                recipeDeletedSuccessfully:false,
                errorCode: res.status,
                errorMessage: res.statusText,
                showDeleteSuccess: false 
            });
            return res.json()
        }
        })
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
      const uploadButton = (
        <div>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
      const { imageUrl } = this.state;
        //reference to the meta component of the card
        const { getFieldDecorator } = this.props.form;
        let Meta = Card.Meta
        //Customise the ant-design card component
        return <div><Card  type="inner" title={this.props.title} style={{ width: '100%'}}
                  cover={<img alt="example" src={this.props.mainImageURL} style={{ height: 320}} onClick={this.handleClick} />}
                  actions={[
                    <Icon type="edit" key="edit" onClick={this.showModal} />,
                    <Popconfirm placement="topLeft" title={text} onConfirm={this.handleDelete} okText="Yes" cancelText="No">
                    <Icon type="delete" key="delete" /></Popconfirm>,
                  ]}
                  >
                  Click image to view recipe and recipe ingredients and steps
                  Category:{this.props.categoryId}
                  Author ID: {this.props.authorId}
                    <Meta
                    description={this.props.subtitle}
                    className="This is the description"
                  />
        </Card>
        <Modal
        title="Recipe Modal"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
        >
          <div>
            <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
            >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
            <Form onSubmit={this.handleSubmit} align="center">
                <Form.Item label="Title" hasFeedback>
                    {getFieldDecorator('title', {
                        initialValue: this.props.title,
                        rules: [
                            {
                                required: true,
                                message: 'Enter new title',
                            },
                        ],
                    })(<Input addonBefore="Title" disabled={(this.state.disabled)? true : false} />)}
                </Form.Item>
                <Form.Item label="Subtitle" hasFeedback>
                    {getFieldDecorator('subtitle', {
                        initialValue: this.props.subtitle,
                        rules: [
                            {
                                required: true,
                                message: 'Enter new subtitle',
                            },
                        ],
                    })(<Input addonBefore="Subtitle" disabled={(this.state.disabled)? true : false} />)}
                </Form.Item>
                <Form.Item label="CategoryId" hasFeedback>
                    {getFieldDecorator('categoryId', {
                        rules: [{ required: true, message: "Please select your recipe's category!" }],
                    })(
                        <Select placeholder="Please select a category" disabled={(this.state.disabled)? true : false}>
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
               
                {this.state.showSuccess ? <Alert message="Recipe updated successfully" type="success" /> :null}
                {this.state.showError ? <Alert message={"Error code " + this.state.errorCode + " " + this.state.errorMessage} type="error" /> :null}
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update
                    </Button>
                    <Button  onClick = {this.handleGameClik.bind(this)}> {this.state.text}  </Button>
                    {this.state.showDeleteSuccess ? <Alert message="Recipe deleted successfully" type="success" /> :null}
                    {this.state.showError ? <Alert message={"Error code " + this.state.errorCode + " " + this.state.errorMessage} type="error" /> :null}
                </Form.Item>
                </Form>
                </div>
      </Modal>
      </div>
    }
}

const RecipeCard = Form.create({ name: 'RecipeCard' })(RecipeDeck);
export default RecipeCard;