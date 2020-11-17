import React, { Component } from 'react';
import { withRouter } from "react-router";
import Header from "../../Components/header/header"
import captureImg from "../../assets/camera_take.png"
import Webcam from '../../Components/Webcam.react';
import frameURL from "../../assets/ic_poadoc.png"
import Button from "../../Components/button/button"
import { captureUserMedia, VideoUpload, changeCamera, durationFormat } from '../../lib/BackUtils';

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
            message: ""
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
        captureUserMedia((stream) => {
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
        this.setState({ ImageURL: data })
        this.setState({ previewImageStatuse: true })
        this.setState({ frontCard: true })
        // alert(data);
        // VideoUpload(data, false, (total, progress) => {
        //     // this.setState({ uploadProgress: parseInt(progress * 100 / total) + '  %' });
        // })
        //     .then(r => {
        //         console.log(r)
        //         try {
        //             this.props.history.push({
        //                 pathname: '/result',
        //                 state: {
        //                     score: parseFloat(r.data.score),
        //                     threshold: parseFloat(r.data.threshold),
        //                     message: r.data.message
        //                 }
        //             });
        //         } catch (e) {
        //             console.error(e)
        //             this.setState({ uploading: false })
        //         }
        //     })
        //     .catch(e => {
        //         this.setState({ uploading: false })
        //         console.error(e)
        //     })
        // this.imgRef.current.setAttribute('src', data);

    }
    onReTake = () => {
        this.setState({ previewImageStatuse: false })
    }
    render() {
        return (
            <div>
                <div className="camera-container">
                    <Webcam src={this.state.src} ref={this.webcamRef} />
                    <canvas ref={this.captureRef} width="320" height="240" id="canvas" style={{ display: "none" }}></canvas>
                </div>
                {(this.state.previewImageStatuse) && <div className="preview-container">
                    <img src={this.state.ImageURL} style={{ width: "100%", height: window.innerHeight }} />
                </div>}
                {/* <div className="frame-container">
                    <img src={this.state.frameSrc} style={{ width: "100%", height: window.innerHeight }} />
                </div> */}
                {(!this.state.previewImageStatuse) && <div className="POA-captureButton" onClick={() => this.getImage()}>
                    <img src={this.state.captureImgSrc} className="captureIcon" />
                </div>}
                {/* <div>
                    <p className="messageTitle" style={{ marginTop: window.innerHeight * 0.12 }}>powerd by BIOMIID</p>
                </div> */}
                {/* <div className="message-container" style={{ bottom: window.innerHeight * 0.35 }}>
                    <p style={{ color: "white", }} className="message">Place the {this.state.message} inside the frame and take the photo </p>
                </div> */}
                {(this.state.previewImageStatuse) && <div className="preview-button-container">
                    <Button
                        label="My photo is clear"
                        onClick={() => {
                            window.cameraMode = "front"
                            this.props.history.push('faceliveness')
                            // this.props.history.push('faceliveness')                            
                        }}
                    />
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
