import React, { Component } from 'react';
import Header from '../../Components/whiteHeader/whiteHeader'
import SuccessURL from "../../assets/ic_success.png"
import FailedURL from "../../assets/ic_failed.png"
import imgURL from "../../assets/ic_poa_help.png"
import Button from "../../Components/POAButton/POAButton"

import './POAVeriHelp.css'

class POAVeriHelp extends Component {
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
        this.setState({headerColor:window.headerBackgroundColor})
        this.setState({headerTitleColor: window.headerTextColor})
    }
    onContinue =()=>{
        this.props.history.push('poacamera')
    }

    render() {
        
        return (
            <div className="poaHelp_Container" style={{ height: window.innerHeight }}>
                <Header headerText={""} headerBackgroundColor={this.state.headerColor} url="photolivness" txtColor={this.state.headerTitlecolor} />
                <div className = "main_Container" style = {{marginTop: window.innerHeight * 0.14}}>
                    <p>this is the Protect</p>
                    <img src= {this.state.imgSrc} alt="POA help image" style = {{width:"70%",height:"300px"}}/>
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
export default POAVeriHelp;