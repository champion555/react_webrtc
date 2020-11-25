import React, { Component } from 'react';
import { withRouter } from "react-router";
import Webcam from "react-webcam";
import Header from "../../Components/header/header"
import './POADocumentCamera.css'

class POADocumentCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screenshot: null,
        }
    }
    componentDidMount = () => {

    }
    onCapture = () => {
        const imageSrc = this.webcam.getScreenshot();
        this.setState({ screenshot: imageSrc })
        console.log(this.state.screenshot)
    };
    setRef = webcam => {
        this.webcam = webcam;
    };
    render() {
        const videoConstraints = {
            facingMode: "environment"
        };
        return (
            <div style={{ width: "100%", height: window.innerHeight }}>
                <Header headerText="Scan PoA Document" />
                <div className="POADocumentCamera-Container" style = {{height:window.innerHeight - 50}}>
                    <Webcam
                        audio={false}
                        mirrored={true}
                        mirrored={false}
                        ref={this.setRef}
                        screenshotFormat="image/jpeg"
                        imageSmoothing={true}
                        width={"100%"}
                        height = {window.innerHeight*0.9}
                        screenshotQuality={1.0}
                        videoConstraints={videoConstraints}
                        forceScreenshotSourceSize="flase" />
                </div>

            </div>
        )
    }
}

export default withRouter(POADocumentCamera);