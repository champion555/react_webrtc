import React, { Component } from 'react';
import { withRouter } from "react-router";
import './startButton.css';

class startButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnClass: props.btnClass
        }
    }

    render() {
        return (
            <div className={"startButton " + this.state.btnClass} onClick={this.props.onClick}>
                <p>{this.props.label}</p>
            </div>
        )
    }
}

export default withRouter(startButton);