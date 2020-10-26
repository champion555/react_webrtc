import React, { Component } from 'react';
import { withRouter } from "react-router";
import FaceDetector from '../../lib/FaceDetector'
import Header from '../../Components/header/header'
import UndetectImgURL from "../../assets/ic_undetected.png"
import captureURL from '../../assets/camera_take.png'
import DetectImgURL from "../../assets/ic_detected.png"

import './FaceLiveness.css';

class FaceLiveness extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sendHeaderText: "Face Liveness",
            ImgSrc: UndetectImgURL,
            faceDetectStatus: "",
            frameHeight: window.innerHeight - 50,
            captureSrc: captureURL,
            faceDetect:"",
            detectorActive: true,

        }
    }

    componentDidMount = () => {
    }

    toggleDetection = () => {
        console.log("capturebutton on clicked")
        this.setState({
            detectorActive: !this.state.detectorActive
        })
        // console.log("IMage URL:", this.state.ComeImage)
    }


    render() {
        const videoConstraints = {
            facingMode: "user"
        };
        let { faceDetectStatus, ImgSrc, detectorActive,captureSrc,faceDetect } = this.state
        return (
            <div>
                <Header headerText={this.state.sendHeaderText} />
                <FaceDetector active={detectorActive}>
                    {facesData => {
                        facesData.map(face => {
                            var faceX = face.x
                            var faceY = face.y
                            var faceSize = face.size
                            var faceStrength = face.strength
                            if (faceSize > 57) {
                                if (43 < faceX && faceX < 55 && 38 < faceY && faceY < 57) {
                                    faceDetectStatus = "Please keep you head in the oval and get closer to the device"
                                    ImgSrc = DetectImgURL
                                    faceDetect = "true"
                                    // detectorActive = !detectorActive
                                } else {
                                    faceDetectStatus = "Please place your face on the oval and get closer to the device"
                                    ImgSrc = UndetectImgURL
                                    faceDetect = "false"
                                }
                            } else {
                                if (30 < faceX && faceX < 60 && 35 < faceY && faceY < 60) {
                                    faceDetectStatus = "Please mover closer the face"
                                    ImgSrc = UndetectImgURL
                                    faceDetect = "false"
                                } else {
                                    faceDetectStatus = "Please place your face on the oval and get closer to the device"
                                    ImgSrc = UndetectImgURL
                                    faceDetect = "false"
                                }
                            }
                        })
                        return (
                            <div>
                                <div className="face-frame-container" >
                                    <img src={ImgSrc} className="face-framImg" style={{ height: this.state.frameHeight }} />
                                </div>
                                <div className="face-message-container">
                                    <p className="face-txtMessage">{faceDetectStatus}</p>
                                </div>
                                {(faceDetect) == "true" && <div className = "face-capture-container"
                                    onClick={this.toggleDetection}>
                                    <img src={captureSrc} style = {{width:"50px",height:"50px"}}/>
                                </div>}
                            </div>
                        )

                    }
                    }

                </FaceDetector>
            </div>
        )
    }
}

export default withRouter(FaceLiveness);
