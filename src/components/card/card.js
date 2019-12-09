import React from 'react';
import './Card.css';
import './tooltip.css';
import FontAwesome from 'react-fontawesome';
import IngredientView from '../ingredientView'

class Card extends React.Component {
  
    constructor(props){
        super(props);

        this.state = {
           cardStyle:{backgroundColor:this.props.backgroundColor},
           bookmarked: false,
        };
        
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onBookmarkClicked = this.onBookmarkClicked.bind(this);
    }

    onClickHandler(event){

        event.preventDefault();
        this.props.onClick(this.props.id);
        //clicked={this.state.clicked}
    }
    onBookmarkClicked(event){

        let currentValue = this.state.bookmarked;
        this.setState({bookmarked:!currentValue});
    }

    render() {

        let bookkmarkIcon;
        let toolTipMessage;

        if(this.state.bookmarked){
            bookkmarkIcon = <FontAwesome name='fas fa-bookmark' className="bookmark bookmarked" size="3x" />
            toolTipMessage = "unbookmark this";
        }
        else{
            bookkmarkIcon = <FontAwesome name='fas fa-bookmark' className="bookmark" size="3x" />
            toolTipMessage = "bookmark this";
        }

        let card_details

        if(this.props.clicked === false) {

                //this is JSX code which is very similar to HTML we already know
                //note that when a card has its title clicked it will call the event handler
                //which was passed from the grid to the card
                
                card_details = 
                <div className="card">
                    <span className='clickableAwesomeFont tooltip' onClick={this.onBookmarkClicked}>
                        <span className="tooltiptext">{toolTipMessage}</span>
                        {bookkmarkIcon}
                    </span>
                    <img src={this.props.image} alt={this.props.imgAlt} style={{width: '100%'}} />
                    <div className="container">
                        <button onClick={this.onClickHandler} className="linkButton"><h4><b>{this.props.title}</b></h4></button>
                        <p>{this.props.description}</p> 
                        <p>{this.props.id}</p> 
                        <p>{this.props.id2}</p> 
                    </div>
                </div>
        }
        else if (this.props.clicked === true) {
            card_details = 
            <div>
            <div className="card">
                    <span className='clickableAwesomeFont tooltip' onClick={this.onBookmarkClicked}>
                        <span className="tooltiptext">{toolTipMessage}</span>
                        {bookkmarkIcon}
                    </span>
                    <img src={this.props.image} alt={this.props.imgAlt} style={{width: '100%'}} />
                    <div className="container">
                        <button onClick={this.onClickHandler} className="linkButton"><h4><b>{this.props.title}</b></h4></button>
                        <p>{this.props.description}</p> 
                        <p>{this.props.id}</p> 
                        <p>{this.props.id2}</p> 
                    </div>
                </div>
                <IngredientView recipeId = {this.props.id2} username= {this.props.username} password = {this.props.password} />
            </div>
        }
        return (
            <div>
                {card_details}
            </div>
        )
        };

        
    }
export default Card;