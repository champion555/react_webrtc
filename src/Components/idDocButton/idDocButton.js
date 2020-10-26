import React, { Component } from 'react';
import { withRouter } from "react-router";
import ImageURL from "../../assets/ic_idcard_purple.png"
import './idDocButton.css';

class IDDocButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ImageSrcs: ImageURL,

        }
    }

    render() {
        return (            
            <div className="IDDocButton" onClick={this.props.onClick}>
                <img src={this.props.imgURL} onClick={this.goBack} className="imgIcon" />
                <p style={{marginLeft:"10px"}}>{this.props.label}</p>
            </div>              

        )
    }
}

export default withRouter(IDDocButton);