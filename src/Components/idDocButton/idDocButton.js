import React, { Component } from 'react';
import { withRouter } from "react-router";
import ImageURL from "../../assets/ic_right.png"
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
                <p style={{marginLeft:"10px", marginBottom:"0px",fontSize:"15px",fontWeight:"600",color:this.props.textColor}}>{this.props.label}</p>
                {/* <img src={this.state.ImageSrcs} className="arrowRight" /> */}
            </div>              

        )
    }
}

export default withRouter(IDDocButton);