import React, { Component } from 'react';
import { withRouter } from "react-router";
import './POAButton.css';

class POAButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnClass: props.btnClass,
            backgroundColor:"#7f00ff"
        }
    }
    componentDidMount = () => {
        console.log(this.props.backgroundColor)
        this.setState({backgroundColor: "#7f00ff"})
    }

    render() {
        return (
            <div className={"POAButton "} onClick={this.props.onClick} style = {{background:this.state.backgroundColor}}>
                <p>{this.props.label}</p>
            </div>
        )
    }
}

export default withRouter(POAButton);