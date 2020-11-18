import React, { Component } from 'react';
import { withRouter } from "react-router";
import Header from "../../Components/header/header"
import captureImg from "../../assets/camera_take.png"
import Webcam from '../../Components/Webcam.react';
import frameURL from "../../assets/ic_background.png"
import errorURL from "../../assets/ic_error.png"
import Button from "../../Components/button/button"
import backURL from "../../assets/ic_back.png"
import { captureUserMedia, VideoUpload, changeCamera, durationFormat } from '../../lib/BackUtils';
import { ImageQuality } from '../../lib/AppUtils';
import datauritoblob from 'datauritoblob'
import './IDDocCamera.css';

const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);

class IDDocCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            frameHeight: window.innerHeight,
            captureImgSrc: captureImg,
            IDDocImgURL: null,
            frameSrc: frameURL,
            ImageSrcs: backURL,
            previewImageStatuse: false,
            frontCard: true,
            IDTarget: "",
            message: "",
            titleMessage: "",
            idTitle: "",
            isErrorStatus: false,
            errorIconURL:errorURL,
        };
        this.requestUserMedia = this.requestUserMedia.bind(this);
        this.webcamRef = React.createRef()
        this.captureRef = React.createRef()
    }

    componentDidMount = () => {
        console.log(window.countryName)
        console.log(window.IDType)
        console.log(window.cameraMode)
        if (!hasGetUserMedia) {
            alert("Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.");
            return;
        }
        this.requestUserMedia();
        this.onSetMessage();
    }
    onSetMessage = () => {
        if (window.IDType == "idcard") {
            this.setState({ IDTarget: "frontIDCard" })
            this.setState({ message: "Place the front page of ID Card inside the frame and take the photo" })
            this.setState({ titleMessage: "National ID Card" })
            this.setState({ idTitle: "Front National ID Card" })
        } else if (window.IDType == "passport") {
            this.setState({ IDTarget: "passport" })
            this.setState({ idTitle: "Passport" })
            this.setState({ message: "Place the Passport inside the frame amd take the photo" })
            this.setState({ titleMessage: "Passport" })
        } else if (window.IDType == "resident") {
            this.setState({ IDTarget: "frontResident" })
            this.setState({ idTitle: "Front Resident Permit" })
            this.setState({ message: "Place the front page of Resident Permit inside the frame and take the photo" })
            this.setState({ titleMessage: "Resident Permit" })
        }
    }
    requestUserMedia() {
        console.log('requestUserMedia')
        localStorage.setItem("cameraMode", "back")
        captureUserMedia((stream, data) => {
            this.setState({ src: stream });
        });

        setInterval(() => {
            if (this.startTime) {
                var duration = new Date().getTime() - this.startTime;
                this.setState({ recordDuration: durationFormat(duration) });
            }

        }, 1000);
    }
    getImage() {
        console.log("buttong clicked")
        // this.setState({ response: '', uploadProgress: '', uploading: true })
        this.captureRef.current.setAttribute('width', this.webcamRef.current.videoRef.current.videoWidth)
        this.captureRef.current.setAttribute('height', this.webcamRef.current.videoRef.current.videoHeight)
        var context = this.captureRef.current.getContext('2d');
        console.log(this.webcamRef.current.videoRef.current.videoWidth, this.webcamRef.current.videoRef.current.videoHeight);
        console.error(this.captureRef.current.width, this.captureRef.current.height)
        var height = this.webcamRef.current.videoRef.current.videoHeight * (this.captureRef.current.width / this.webcamRef.current.videoRef.current.videoWidth);
        context.drawImage(this.webcamRef.current.videoRef.current, 0, 0, this.captureRef.current.width, height);
        var data = this.captureRef.current.toDataURL('image/jpeg');

        ImageQuality(data, (total, progress) => {
        }).then(res => {
            var response = res.data;
            console.log(response, response.message, response.errorList);
            this.setState({ previewImageStatuse: true })
            this.setState({ frontCard: true })
            this.setState({ IDDocImgURL: data })
            if (response.statusCode == "200") {                
                let { IDTarget } = this.state
                if (IDTarget == "frontIDCard") {
                    this.setState({ titleMessage: "Image preview" })
                    this.setState({ message: "Make sure the ID Docment image is clear to read" })
                } else if (IDTarget == "passport") {
                    this.setState({ titleMessage: "Image preview" })
                    this.setState({ message: "Make sure the ID Docment image is clear to read" })
                } else if (IDTarget == "frontResident") {
                    this.setState({ titleMessage: "Image preview" })
                    this.setState({ message: "Make sure the ID Docment image is clear to read" })
                } else if (IDTarget == "backIDCard") {
                    this.setState({ titleMessage: "Image preview" })
                    this.setState({ message: "Make sure the ID Docment image is clear to read" })
                } else if (IDTarget == "backResident") {
                    this.setState({ titleMessage: "Image preview" })
                    this.setState({ message: "Make sure the ID Docment image is clear to read" })
                }
            } else {
                this.setState({ titleMessage: "Image preview" })
                this.setState({ isErrorStatus: true })
            }

        }).catch(e => {
            alert("the server is not working, Please try again.");
        })
    }
    onReTake = () => {
        this.setState({ previewImageStatuse: false })
        this.setState({isErrorStatus:false})
        let { IDTarget } = this.state
        if (IDTarget == "frontIDCard") {
            this.setState({ message: "Place the front page of ID Card inside the frame and take the photo" })
            this.setState({ titleMessage: "National ID Card" })
        } else if (IDTarget == "passport") {
            this.setState({ message: "Place the Passport inside the frame and take the photo" })
            this.setState({ titleMessage: "Passport" })
        } else if (IDTarget == "frontResident") {
            this.setState({ message: "Place the front page of Resident Permit inside the frame and take the photo" })
            this.setState({ titleMessage: "Resident Permit" })
        } else if (IDTarget == "backIDCard") {
            this.setState({ message: "Place the back page of ID Card inside the frame and take the photo" })
            this.setState({ titleMessage: "National ID Card" })
        } else if (IDTarget == "backResident") {
            this.setState({ message: "Place the back page of Resident Permit inside the frame and take the photo" })
            this.setState({ titleMessage: "Resident Permit" })
        }
    }

    render() {
        return (
            <div>
                <div className="camera-container">
                    <Webcam src={this.state.src} ref={this.webcamRef} />
                    <canvas ref={this.captureRef} width="320" height="240" id="canvas" style={{ display: "none" }}></canvas>
                </div>
                {(this.state.previewImageStatuse) && <div className="preview-container">
                    <img src={this.state.IDDocImgURL} style={{ width: "100%", height: window.innerHeight }} />
                </div>}
                <div className="frame-container">
                    <img src={this.state.frameSrc} style={{ width: "100%", height: window.innerHeight }} />
                </div>
                <p className="messageTitle" style={{ bottom: "5px" }}>powerd by BIOMIID</p>
                {(!this.state.previewImageStatuse) && <div className="captureButton" onClick={() => this.getImage()}>
                    <img src={this.state.captureImgSrc} className="captureIcon" />
                </div>}
                {(!this.state.isErrorStatus) && <div className="message-container" style={{ bottom: window.innerHeight * 0.32 }}>
                    <p style={{ textAlign: "center", color: "white", fontSize: "20px", fontWeight: "bold", marginBottom:"0px" }}>{this.state.idTitle}</p>
                    <p style={{ color: "white", }} className="message">{this.state.message}</p>
                </div>}
                {(this.state.isErrorStatus) && <div className = "errorMessage" style={{ bottom: window.innerHeight * 0.32 }}>
                    <div className = "container">
                        <div className = "title">   
                            <img src={this.state.errorIconURL} />
                            <p>The image quality is very low</p>
                        </div>
                        <div className = "message">
                            <p>- Make sure the image is not blurry or contains blares!</p>
                        </div>
                    </div>
                </div>}
                <div className="top-container">
                    <img src={this.state.ImageSrcs} style={{ width: "20px", height: "20px", marginLeft: "10px" }}
                        onClick={() => {
                            this.props.history.goBack()
                        }} />
                    <p style={{ color: "white", marginLeft: "20px" }}>{this.state.titleMessage}</p>
                    {(!this.state.previewImageStatuse) && <p style={{ color: "white", marginLeft: "auto", marginRight: "10px" }}>{window.countryName}</p>}
                </div>
                {(this.state.previewImageStatuse) && <div className="preview-button-container">
                {(!this.state.isErrorStatus) && <Button
                        label="My photo is clear"
                        onClick={() => {
                            let { IDTarget } = this.state
                            if (IDTarget == "frontIDCard") {
                                this.setState({ IDTarget: "backIDCard" })
                                this.setState({ titleMessage: "National ID Card" })
                                this.setState({ idTitle: "Back National ID Card" })
                                this.setState({ message: "Place the back page of ID Card inside the frame and take the photo" })
                                this.setState({ previewImageStatuse: false })
                                window.FrontIDCardPath = this.state.IDDocImgURL
                            } else if (IDTarget == "passport") {
                                this.props.history.push('idmain')
                                window.PassportPath = this.state.IDDocImgURL
                            } else if (IDTarget == "frontResident") {
                                this.setState({ IDTarget: "backResident" })
                                this.setState({ titleMessage: "Resident Permit" })
                                this.setState({ idTitle: "Back Resident Permit" })
                                this.setState({ message: "Place the back page of Resident Permit inside the frame and take the photo" })
                                this.setState({ previewImageStatuse: false })
                                window.FrontResidentPath = this.state.IDDocImgURL
                            } else if (IDTarget == "backIDCard") {
                                this.props.history.push('idmain')
                                window.BackIDCardPath = this.state.IDDocImgURL
                            } else if (IDTarget == "backResident") {
                                this.props.history.push('poadoc')
                                window.BackResidentPath = this.state.IDDocImgURL
                            }
                        }}
                    />}
                    <Button
                        label="Re-take"
                        onClick={this.onReTake}
                    />
                </div>}
            </div>
        )
    }
}

export default withRouter(IDDocCamera);
