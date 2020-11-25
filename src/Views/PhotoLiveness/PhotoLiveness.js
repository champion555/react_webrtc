import React, { Component } from 'react';
import { withRouter } from "react-router";
import captureImg from "../../assets/camera_take.png"
import UndetectImgURL from "../../assets/ic_undetected.png"
import DetectImgURL from "../../assets/ic_detected.png"
import BackURL from "../../assets/ic_back.png"
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
            backButtonSrc: BackURL

        };

    }

    getImage() {
        this.setState({ ImgSrc: DetectImgURL })
        console.log("button clicked")
        this.captureRef.current.setAttribute('width', this.webcamRef.current.videoRef.current.videoWidth)
        this.captureRef.current.setAttribute('height', this.webcamRef.current.videoRef.current.videoHeight)
        var context = this.captureRef.current.getContext('2d');
        console.log(this.webcamRef.current.videoRef.current.videoWidth, this.webcamRef.current.videoRef.current.videoHeight);
        console.error(this.captureRef.current.width, this.captureRef.current.height)
        var height = this.webcamRef.current.videoRef.current.videoHeight * (this.captureRef.current.width / this.webcamRef.current.videoRef.current.videoWidth);
        context.drawImage(this.webcamRef.current.videoRef.current, 0, 0, this.captureRef.current.width, height);
        var data = this.captureRef.current.toDataURL('image/jpeg');

        this.setState({ apiFlage: true })
        PhotoUpload(data, (total, progress) => {
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

    }
    render() {
        const videoConstraints = {
            facingMode: "user"
        };
        return (
            <div>
                <div className="camera-container">
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
                <div className="frame-view" style={{ height: "100vh", backgroundImage: `url(${this.state.ImgSrc})`, backgroundSize: "100% 100%" }} >
                    <div className="topBar">
                        <img src={this.state.backButtonSrc} onClick={() => this.props.history.push('poadoc')} className="btnBack" />
                        <h2 className="txtTitle">Face Liveness</h2>
                        <div style={{ width: '10px' }}></div>
                    </div>
                    <div className="liveness-captureButton" onClick={() => this.getImage()}>
                        <p style={{ font: "18px", color: "white", textAlign: "center" }}>Please place your face on the oval and take the photo </p>
                        <img src={this.state.captureImgSrc} className="captureIcon" />
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
