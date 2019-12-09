//import axios from 'axios';
//import config from './config';

//this class will have all the methods that we need to connect to the API
class CallAPI {
    constructor(props){

        this.state = {
        username: '',
        password: ''
    }
    }
    getRecipe(logininfo, callback){
        console.log (logininfo.Id)
        let authorId = logininfo.Id
        let limit = 300
        fetch(`http://localhost:3000/api/v1.0/recipe?limit=${limit}`,{
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + window.btoa(logininfo.username + ':' + logininfo.password),
                    }
        }).then(res => {
            console.log(logininfo.username)
            return res.json()
        .then(data => callback(null, data))
        }).catch( (error) => {
            console.log("An error has occurred:" + error)
            callback(error)
            })
    }
    
    
}

export default CallAPI;

