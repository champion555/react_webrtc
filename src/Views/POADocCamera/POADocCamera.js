import React, { Component } from 'react';
import { withRouter } from "react-router";
import Header from "../../Components/header/header"
import captureImg from "../../assets/camera_take.png"
import Webcam from '../../Components/Webcam.react';
import frameURL from "../../assets/ic_poadoc.png"
import errorURL from "../../assets/ic_error.png"
import Button from "../../Components/button/button"
import { captureUserMedia, VideoUpload, changeCamera, durationFormat } from '../../lib/BackUtils';
import { ImageQuality } from '../../lib/AppUtils';
import './POADocCamera.css';

const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);

class POADocCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            frameHeight: window.innerHeight,
            captureImgSrc: captureImg,
            ImageURL: null,
            frameSrc: frameURL,
            previewImageStatuse: false,
            frontCard: true,
            message: "",
            isErrorStatus: false,
            errorIconURL: errorURL,
            facingMode:"environment"
        };
        this.requestUserMedia = this.requestUserMedia.bind(this);
        this.webcamRef = React.createRef()
        this.captureRef = React.createRef()

    }
    componentDidMount = () => {
        console.log(window.countryName)
        console.log(window.IDType)
        if (!hasGetUserMedia) {
            alert("Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.");
            return;
        }
        this.requestUserMedia();
        // this.onSetMessage();
    }
    requestUserMedia() {
        console.log('requestUserMedia')
        localStorage.setItem("cameraMode", "back")
        let backCam = this.state.facingMode
        captureUserMedia((stream,backCam) => {
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
            this.setState({ ImageURL: data })
            if (response.statusCode == "200") {
                this.setState({ isErrorStatus: false })
            } else {
                this.setState({ isErrorStatus: true })
            }
        }).catch(e => {

            alert("image checking failed, Please try again.");

        })

    }
    onReTake = () => {
        this.setState({ previewImageStatuse: false })
        this.setState({ isErrorStatus: false })
    }
    render() {
        return (
            <div>
                <Header headerText="Scan PoA Document" />
                <div className="camera-container">
                    <Webcam src={this.state.src} ref={this.webcamRef} />
                    <canvas ref={this.captureRef} width="320" height="240" id="canvas" style={{ display: "none" }}></canvas>
                </div>
                {(this.state.previewImageStatuse) && <div className="preview-container">
                    <img src={this.state.ImageURL} style={{ width: "100%", height: window.innerHeight }} />
                </div>}
                {(this.state.isErrorStatus) && <div className="errorMessage" style={{ bottom: window.innerHeight * 0.35 }}>
                    <div className="container">
                        <div className="title">
                            <img src={this.state.errorIconURL} />
                            <p>The image quality is very low</p>
                        </div>
                        <div className="message">
                            <p>- Make sure the image is not blurry or contains blares!</p>
                        </div>
                    </div>
                </div>}
                {(!this.state.previewImageStatuse) && <div className="POA-captureButton" onClick={() => this.getImage()}>
                    <img src={this.state.captureImgSrc} className="captureIcon" />
                </div>}
                {(this.state.previewImageStatuse) && <div className="preview-button-container">
                {(!this.state.isErrorStatus) && <Button
                        label="My photo is clear"
                        onClick={() => {
                            window.cameraMode = "front"
                            localStorage.setItem("poaDocPath", this.state.ImageURL)
                            this.props.history.push('photoliveness')
                        }}
                    />}
                    <Button
                        label="Re-take"
                        onClick={this.onReTake}
                    />
                    <canvas id="croppedCanvas" />
                </div>}
            </div>
        )
    }
}

export default withRouter(POADocCamera);
