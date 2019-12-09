import React from "react";
import "./style.css";
// import Popup from "./popup";
import axios from 'axios';
import { object } from "prop-types";
import { Result } from "antd";


class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      password: this.props.password,
      query: '',
      results: {},
      message: '',
    }
      this.cancel = '';
  };

  handleOnInputChange = ( event ) => {
      const query = event.target.value;
      this.setState( { query: query, message: '' }, ()=> {
      this.fetchDbResults(query); 
      // this.fetchSearchResults(query);
      }); 
  };

fetchDbResults = (query) =>{
  const searchApi = `http://localhost:3000/api/v1.0/search/${query}`

  if( this.cancel ) {
    this.cancel.cancel();
}

this.cancel = axios.CancelToken.source();
const username = 'MJ24'
const password = 'hello123'
const basicAuth = 'Basic ' + btoa(username + ':' + password);

// axios.get( searchApi, {
//   cancelToken: this.cancel.token
// },{ headers: { 'Authrization': + basicAuth} })
axios({
  method: 'get',
  url: searchApi,
  auth: {
    username: this.props.username,
    password: this.props.password
  }
})
    .then ( res => {
      const resultNotFoundMsg = ! res.data.length
                              ? 'No more search results'
                              : '';
      this.setState( {
        results: res.data,
        message: resultNotFoundMsg
      })  
        
    })
.catch( error => {
  if ( axios.isCancel(error) || error) {
      this.setState( {
        message: 'AY! that was a mis-take'
      })

  }
})

}
// fetchSearchResults = (query) => {
//     const searchUrl =  `https://api.edamam.com/search?q=${query}&app_id=e8eee3ca&app_key=5f25a27d3960451fb38dce55206bdb5a`

//     if( this.cancel ) {
//         this.cancel.cancel();
//     }

//     this.cancel = axios.CancelToken.source();
    
//     axios.get( searchUrl, {
//       cancelToken: this.cancel.token
//     })
//         .then ( res => {
//           const resultNotFoundMsg = ! res.data.hits.length
//                                   ? 'No more search results'
//                                   : '';
//           this.setState( {
//             results: res.data.hits,
//             message: resultNotFoundMsg
//           })  
                        
//         })
//     .catch( error => {
//       if ( axios.isCancel(error) || error) {
//           this.setState( {
//             message: 'AY! that was a mis-take'
//           })

//       }
//     })
//   }
  

  renderSearchResults = () => {
    const { results } = this.state;

    if( Object.keys( results ).length && results.length ) {
      return (
        <div className="results-container">
          { results.map( result => {
            return(
              <div>
              {/* // <a key={result.uri} href={ result.recipe.url } className="result-item"> */}
                <div className="image-wrapper"></div>
                {/* // <img className="image" src={ result.recipe.image } alt={`${null}`}/> */}
              <div><h3>{result.title}</h3></div>
                
              </div>

              
            )
          })}


        </div>
      )

    }
  }

  render() {
    const { query } = this.state;
    
    return (
      <div className="search">
        <div className="search-container">
          <div className="title">Search Recipe</div>
          <div className="content">
            <input
              type="text"
              value={query}
              name="query"
              placeholder="Search..."
              onChange={this.handleOnInputChange}
//              onInput={this.onInput.bind(this)}
            />
            {/* <Popup isOpen={showResult} items={foundFoods} />  */}
            {this.renderSearchResults()}
          </div>
        </div>
      </div>
    );
  }
}
export default Search