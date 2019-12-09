// API Search Component
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
      query: '',
      results: {},
      message: '',
      currentPage: 1,
      resultsPerPage: 5,
    }
      this.cancel = '';
  };

  handleOnInputChange = ( event ) => {
      const query = event.target.value;
      this.setState( { query: query, message: '' }, ()=> {
          this.fetchSearchResults(query);
      }); 
  };


fetchSearchResults = (query) => {
    const searchUrl =  `https://api.edamam.com/search?q=${query}&app_id=e8eee3ca&app_key=3afae5888c3f5bee8cb35fa5b15a504e`

    if( this.cancel ) {
        this.cancel.cancel();
    }

    this.cancel = axios.CancelToken.source();
    
    axios.get( searchUrl, {
      cancelToken: this.cancel.token
    })
        .then ( res => {
          const resultNotFoundMsg = ! res.data.hits.length
                                  ? 'No more search results'
                                  : '';
          this.setState( {
            results: res.data.hits,
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
  

  renderSearchResults = () => {
    const { results } = this.state;

    if( Object.keys( results ).length && results.length ) {
      return (
        <div className="results-container">
          { results.map( result => {
            return(
              <a key={result.uri} href={ result.recipe.url } className="result-item">
                <div className="image-wrapper"></div>
                <img className="image" src={ result.recipe.image } alt={`${null}`}/>
                

              </a>
            )
          })}


        </div>
      )

    }
  }

  render() {
    const { query, currentPage, resultsPerPage, results } = this.state;
    
    const indexOfLastResults = currentPage * resultsPerPage;
    const indexOfFirstResults = indexOfLastResults - resultsPerPage;
    const resultsPage = results.slice(indexOfFirstResults, indexOfLastResults);

    const renderResults = resultsPage.map((results, index)=>{
      return <li key={index}>{results}</li>;

    });

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(results.length / resultsPerPage); i++) {
      pageNumbers.push(i);
    }
// salut
    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <li
          key={number}
          id={number}
          onClick={this.handleClick}
        >
          {number}
        </li>
      );
    });

    return (
      <div>
        <ul>
          {renderResults}
        </ul>
        <ul id="page-numbers">
          {renderPageNumbers}
        </ul>
      </div>,
    
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
  // }
// }

//bonjour
    
  }
}
export default Search