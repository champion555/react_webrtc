import React, { Component } from 'react';
import Header from '../../Components/whiteHeader/whiteHeader'
import SuccessURL from "../../assets/ic_success.png"
import FailedURL from "../../assets/ic_failed.png"
import imgURL from "../../assets/ic_faceliveness_help.png"
import Button from "../../Components/POAButton/POAButton"

import './LivenessHelp.css'

class LivenessHelp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtColor: "gray",
            imgSrc: imgURL,
            headerColor: "#7f00ff",
            headerTitlecolor: "white",

        }
    }
    componentDidMount() {
        this.setState({ txtColor: window.pageTextColor })
        this.setState({headerColor:window.headerBackgroundColor})
        this.setState({headerTitleColor: window.headerTextColor})
    }
    onContinue =()=>{
        console.log("the continue button clicked")
        this.props.history.push('photoliveness')
    }

    render() {
        return (
            <div className="livenessHelp_Container" style={{ height: window.innerHeight }}>
                <Header headerText={""} headerBackgroundColor={this.state.headerColor} url="photolivness" txtColor={this.state.headerTitlecolor} />
                <div className = "main_Container">
                    <p>this is the description, in here, you can describe how to  check face lieveness</p>
                    <img src= {this.state.imgSrc} alt="Liveness help image" style = {{width:"60%",height:"300px"}}/>
                </div>
                <div className="buttonView">
                    <Button
                        backgroundColor = {window.buttonBackgroundColor}
                        buttonTextColor = {window.buttonTextColor}
                        label={"OK, I AM READY"}
                        onClick={() => this.onContinue()} />
                </div>
                <p className = "footerTitle" style={{color: this.state.txtColor }}>Powerd by BIOMIID</p>
            </div>
        )
    }
}
export default LivenessHelp;