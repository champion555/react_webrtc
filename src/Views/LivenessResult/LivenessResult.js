import React, { Component } from 'react';
import Header from "../../Components/header/header"
import SuccessURL from "../../assets/ic_success.png"
import FailedURL from "../../assets/ic_failed.png"
import UnableURL from "../../assets/ic_unable.png"

import './LivenessResult.css'

class LivenessResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sendHeaderText:'Face Liveness Result',
            imgSrc:SuccessURL,
            message:"",
            unableFlag: false
            
        }
    }
    componentDidMount = () => {
        alert(window.livenessResult)
        if(window.livenessResult === "SPOOF"){
            this.setState({imgSrc:FailedURL})
            this.setState({message:"Spoof detected"})
        }else{
            this.setState({imgSrc:UnableURL})
            this.setState({message:"Unable to confirm liveness"})
            this.setState({unableFlag:true})

        }
        
    }
    render() {
        return (
            <div>
                 <Header headerText = {this.state.sendHeaderText} url="idresult"/>
                 <div className = "result-body-container">
                    <img src = {this.state.imgSrc} className = "resultMark"/>
                    <p className = "txtLivnessResult"> {this.state.message} </p>
                    {(this.state.unableFlag) && <p className = "txtErrorMessage">Image is too blurry or contain glares! </p>}
                    {/* <div className = "spoof-container">
                        <p style={{marginLeft:'40px'}} > Face Liveness Confirmed</p>
                        <img src = {this.state.imgSrc} className = "spoofMark"/>
                    </div> */}
                    
                 </div>
            </div>
        )
    }
}
export default LivenessResult;