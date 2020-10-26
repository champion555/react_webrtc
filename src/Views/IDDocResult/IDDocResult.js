import React, { Component } from 'react';
import Header from "../../Components/header/header"
import SuccessURL from "../../assets/ic_success.png"
import FailedURL from "../../assets/ic_failed.png"

import './IDDocResult.css'

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sendHeaderText:'Result',
            imgSrc:SuccessURL
        }
    }
    // ComponentDidamount = () => {
    //     console.log("home")
    // }
    render() {
        return (
            <div>
                 <Header headerText = {this.state.sendHeaderText} url="idresult"/>
                 <div className = "result-body-container">
                    <img src = {this.state.imgSrc} className = "resultMark"/>
                    <p className = "txtLivnessResult">Liveness confirmed </p>
                    <div className = "socre-container">
                        <p style={{marginLeft:'100px'}} > score</p>
                        <p style = {{marginRight:'100px'}}> 0.9876554</p>
                    </div>
                 </div>
            </div>
        )
    }
}
export default Result;