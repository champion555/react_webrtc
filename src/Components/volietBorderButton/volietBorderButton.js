import React, { Component } from 'react';
import { withRouter } from "react-router";
import './volietBorderButton.css';

class BorderButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnClass: props.btnClass
        }
    }

    render() {
        return (
            <div className={"BorderButton "} onClick={this.props.onClick}>
                <p>{this.props.label}</p>
            </div>
        )
    }
}

export default withRouter(BorderButton);