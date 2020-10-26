import React, { Component } from 'react';
import { withRouter } from "react-router";
import './button.css';

class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnClass: props.btnClass
        }
    }

    render() {
        return (
            <div className={"Button " + this.state.btnClass} onClick={this.props.onClick}>
                <p>{this.props.label}</p>
            </div>
        )
    }
}

export default withRouter(Button);