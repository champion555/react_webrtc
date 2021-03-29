import React, { Component } from 'react';
import { withRouter } from "react-router";
import './POAButton.css';

class POAButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnClass: props.btnClass,
            background:"#7133ff",
            buttonTextColor:"#fff"
        }
    }
    componentDidMount = () => {
        console.log("ssssssssssssssssssss", this.props.backgroundColor)
        if(this.props.backgroundColor != null){
            this.setState({background: this.props.backgroundColor})
        }
        if(this.props.buttonTextColor != null){
            this.setState({background: this.props.buttonTextColor})
        }        
        
    }

    render() {
        return (
            <div className={"POAButton "} onClick={this.props.onClick} style = {{background:this.props.backgroundColor ? this.props.backgroundColor: this.state.background}}>
                <p style = {{color: this.state.buttonTextColor}}>{this.props.label}</p>
            </div>
        )
    }
}

export default withRouter(POAButton);