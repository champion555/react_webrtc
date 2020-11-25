import React, { Component } from 'react';
import { withRouter } from "react-router";
import captureImg from "../../assets/camera_take.png"
import UndetectImgURL from "../../assets/ic_undetected1.png"
import DetectImgURL from "../../assets/ic_detected1.png"
import BackURL from "../../assets/ic_back.png"
import Button from "../../Components/button/button"
import LogoURL from "../../assets/ic_logo1.png"
import { PhotoUpload } from '../../lib/AppUtils';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './PhotoLiveness.css';
import Webcam from "react-webcam";
import { within } from '@testing-library/react';

class PhotoLiveness extends Component {
    constructor(props) {
        super(props);
        this.state = {
            frameHeight: window.innerHeight,
            captureImgSrc: captureImg,
            ImageURL: null,
            ImgSrc: UndetectImgURL,
            logoSrc: LogoURL,
            apiFlage: false,
            backButtonSrc: BackURL,
            screenshot: null,

        };

    }
    onCapture = () => {
        const imageSrc = this.webcam.getScreenshot();
        this.setState({ screenshot: imageSrc })

        this.setState({ apiFlage: true })
        PhotoUpload(imageSrc, (total, progress) => {
        }).then(res => {
            this.setState({ apiFlage: false })
            var response = res.data;

            if (response.result === "LIVENESS") {
                this.props.history.push('iddocresult')
            } else if (response.result === "SPOOF") {
                window.livenessResult = response.result
                this.setState({ ImgSrc: UndetectImgURL })
                this.props.history.push('livenessresult')
            } else {
                window.livenessResult = response.result
                this.setState({ ImgSrc: UndetectImgURL })
                this.props.history.push('livenessresult')
            }

        }).catch(e => {
            alert("the server is not working, Please try again.");
            this.setState({ apiFlage: false })
            this.setState({ ImgSrc: UndetectImgURL })
        })
    };
    setRef = webcam => {
        this.webcam = webcam;
    };
    render() {
        const videoConstraints = {
            facingMode: "user"
        };
        return (
            <div>
                <div className="LivenessCamera-Container">
                    <Webcam
                        audio={false}
                        mirrored={true}
                        ref={this.setRef}
                        screenshotFormat="image/jpeg"
                        imageSmoothing={true}
                        width={"100%"}
                        screenshotQuality={1.0}
                        videoConstraints={videoConstraints}
                        forceScreenshotSourceSize="flase"
                    />
                </div>
                <div style={{ position: "absolute", zIndex: "2", width: "100%", height: window.innerHeight }}>
                    <div className="LivenessTopBar" style={{ height: window.innerHeight * 0.07 }}>
                        <img src={this.state.backButtonSrc} onClick={() => this.props.history.push('poadoc')} className="btnBack" />
                        <h2 className="txtTitle">Face Liveness</h2>
                        <div style={{ width: '10px' }}></div>
                    </div>
                    <div style={{ width: "100%", height: window.innerHeight * 0.68,backgroundImage:`url(${this.state.ImgSrc})`,backgroundSize:"100% 100%" }}></div>
                    <div className="liveness-captureButton" style={{ height: window.innerHeight * 0.25 }}>
                        <p style={{ font: "18px", color: "white", textAlign: "center", marginBottom: "5px" }}>Please place your face on the oval and take the photo </p>
                        <Button
                            label="Take A Picture"
                            onClick={() => this.onCapture()}
                        />

                    </div>
                </div>

                {(this.state.apiFlage) && <div style={{ width: "100%", height: window.innerHeight, zIndex: 20, background: "#7f00ff", position: "absolute", textAlign: "center" }}>
                    <img src={this.state.logoSrc} style={{ width: "100px", marginTop: window.innerHeight - 100 }} />
                </div>}
                {(this.state.apiFlage) && <div className="loadingView" style={{ bottom: window.innerHeight * 0.5 }}>
                    <Loader
                        type="Circles"
                        color="#ffffff"
                        height={80}
                        width={80}
                    />
                </div>}
            </div>
        )
    }
}

export default withRouter(PhotoLiveness);
