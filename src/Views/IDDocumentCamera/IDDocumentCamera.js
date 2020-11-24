import React, { Component } from 'react';
import { withRouter } from "react-router";
import backURL from "../../assets/ic_back.png"
import Webcam from "react-webcam";
import Camera from 'react-dom-camera';
import './IDDocumentCamera.css'

class IDDocumentCamera extends Component {

    constructor(props) {
        super(props);
        this.state = {
            backButtonSRC: backURL,

        }
    }
    componentDidMount = () => {
        console.log(window.countryName)
        console.log(window.IDType)
        console.log(window.cameraMode)
    }
    setRef = webcam => {
        this.webcam = webcam;
    };

    render() {
        const videoConstraints = {
            facingMode: "environment"
        };
        return (
            <div style={{ width: "100%", height:"100vh", background: "#7f00ff"}}>
                <div style={{ width: "100%", height: window.innerHeight * 0.07, alignItems: "center", display: "flex" }}>
                    <img src={this.state.backButtonSRC} style={{ width: "20px", height: "20px", marginLeft: "10px" }}
                        onClick={() => {
                            this.props.history.goBack()
                        }} />
                    <p style={{ color: "white", marginLeft: "20px", fontWeight: "bold", fontSize: "20px" }}>title message</p>
                    <p style={{ color: "white", marginLeft: "auto", marginRight: "10px" }}>country</p>
                </div>
                <div className="IDCamera-Container" style={{ height: window.innerHeight * 0.4 }}>
                    <Webcam
                        audio={false}
                        height={window.innerHeight*0.4}
                        mirrored={true}
                        mirrored = {false}
                        ref={this.setRef}
                        screenshotFormat="image/jpeg"
                        imageSmoothing = {true}
                        width={"100%"}
                        screenshotQuality = {1.0}
                        videoConstraints={videoConstraints}
                        forceScreenshotSourceSize="false"
                    />
                </div>
                <div className="IDMessage-Container" style={{ height: window.innerHeight * 0.2 }}>
                    <p style={{ textAlign: "center", color: "white", fontSize: "20px", fontWeight: "bold", marginBottom: "0px" }}>this is id title</p>
                    <p style={{ color: "white", }} className="message">this is message</p>
                </div>
                <div className="IDCapture-Container" style={{ height: window.innerHeight * 0.1 }}></div>
            </div>
        )
    }
}

export default withRouter(IDDocumentCamera);