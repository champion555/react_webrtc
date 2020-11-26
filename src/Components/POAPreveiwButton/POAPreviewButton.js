import React, { Component } from 'react';
import { withRouter } from "react-router";
import './POAPreviewButton.css';

class POAPreviewButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnClass: props.btnClass
        }
    }

    render() {
        return (
            <div className={"POAPreviewButton " + this.state.btnClass} onClick={this.props.onClick}>
                <p>{this.props.label}</p>
            </div>
        )
    }
}

export default withRouter(POAPreviewButton);