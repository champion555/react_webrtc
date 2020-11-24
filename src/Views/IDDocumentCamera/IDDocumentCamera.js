import React, { Component } from 'react';
import { withRouter } from "react-router";
import backURL from "../../assets/ic_back.png"
import captureURL from "../../assets/camera_take.png"
import errorURL from "../../assets/ic_error.png"
import Webcam from "react-webcam";
import Camera from 'react-dom-camera';
import './IDDocumentCamera.css'

class IDDocumentCamera extends Component {

    constructor(props) {
        super(props);
        this.state = {
            backButtonSRC: backURL,
            captureButtonSRC:captureURL,
            errorSRC:errorURL,


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
            <div style={{ width: "100%", height: "100vh", background: "#7f00ff" }}>
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
                        height={window.innerHeight * 0.4}
                        mirrored={true}
                        mirrored={false}
                        ref={this.setRef}
                        screenshotFormat="image/jpeg"
                        imageSmoothing={true}
                        width={"100%"}
                        screenshotQuality={1.0}
                        videoConstraints={videoConstraints}
                        forceScreenshotSourceSize="false"
                    />
                </div>
                <div className="IDMessage-Container" style={{ height: window.innerHeight * 0.2 }}>
                    <p className="IDTitle" >this is id title</p>
                    <p className="IDDocCamMeassage">Place the front of National ID Card inside the frame and take the photo</p>
                </div>
                <div className = "errorMessageView" style={{ bottom: window.innerHeight * 0.13 }}>
                    <div className = "container">
                        <div className = "errortitle">   
                            <img src={this.state.errorSRC} />
                            <p>The image quality is very low</p>
                        </div>
                        <div className = "errormessage">
                            <p>- Make sure the image is not blurry or contains blares!</p>
                        </div>
                    </div>
                </div>
                <div className="IDCapture-Container">
                    <img className = "IDCaptureButton" src={this.state.captureButtonSRC} />
                    <p>powerd by BIOMIID</p>
                </div>
            </div>
        )
    }
}

export default withRouter(IDDocumentCamera);