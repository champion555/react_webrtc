import React, { Component } from 'react';
import { withRouter } from "react-router";
import Header from "../../Components/header/header"
import captureImg from "../../assets/camera_take.png"
import Webcam from '../../Components/Webcam.react';
import frameURL from "../../assets/ic_background.png"
import Button from "../../Components/button/button"
import backURL from "../../assets/ic_back.png"
import { captureUserMedia, VideoUpload, changeCamera, durationFormat } from '../../lib/AppUtils';
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
            message: ""
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
    requestUserMedia() {
        console.log('requestUserMedia')
        // localStorage.setItem("cameraMode", "back")
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
        this.setState({ IDDocImgURL: data })
        this.setState({ previewImageStatuse: true })
        this.setState({ frontCard: true })
        let { message } = this.state
        if (message == "front of ID Card") {
            this.setState({ message: "ID Card Front Capture Preview" })
        } else if (message == "passport") {
            this.setState({ message: "passport Capture Preview" })
        } else if (message == "front of Resident Permit") {
            this.setState({ message: "Resident Front Capture Preview" })

        } else if (message == "back of ID Card") {
            this.setState({ message: "ID Card Back Capture Preview" })

        } else if (message == "back of Resident permit") {
            this.setState({ message: "Resident Back Capture Preview" })

        }
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
        let { message } = this.state
        if (message == "ID Card Front Capture Preview") {
            this.setState({ message: "front of ID Card" })
        } else if (message == "passport Capture Preview") {
            this.setState({ message: "passport" })
        } else if (message == "Resident Front Capture Preview") {
            this.setState({ message: "front of Resident Permit" })
        } else if (message == "ID Card Back Capture Preview") {
            this.setState({ message: "back of ID Card" })
        } else if (message == "Resident Back Capture Preview") {
            this.setState({ message: "back of Resident permit" })
        }
    }
    onSetMessage = () => {
        if (window.IDType == "idcard") {
            this.setState({ message: "front of ID Card" })
        } else if (window.IDType == "passport") {
            this.setState({ message: "passport" })
        } else if (window.IDType == "resident") {
            this.setState({ message: "front of Resident Permit" })
        }
    }
    render() {
        return (
            <div>
                {/* <Header headerText="Photo Face Liveness" /> */}
                <div className="camera-container">
                    <Webcam src={this.state.src} ref={this.webcamRef} />
                    <canvas ref={this.captureRef} width="320" height="240" id="canvas" style={{ display: "none" }}></canvas>
                </div>
                {(this.state.previewImageStatuse) && <div className="preview-container">
                    <img src={this.state.ImageURL} style={{ width: "100%", height: window.innerHeight }} />
                </div>}
                <div className="frame-container">
                    <img src={this.state.frameSrc} style={{ width: "100%", height: window.innerHeight }} />
                </div>
                <p className="messageTitle" style = {{bottom:"10px"}}>powerd by BIOMIID</p>

                {(!this.state.previewImageStatuse) && <div className="captureButton" onClick={() => this.getImage()}>
                    <img src={this.state.captureImgSrc} className="captureIcon" />
                </div>}
                <div className="message-container" style={{ bottom: window.innerHeight * 0.35 }}>
                    <p style={{ color: "white", }} className="message">Place the {this.state.message} inside the frame and take the photo </p>
                </div>
                <div className="top-container">
                    <img src={this.state.ImageSrcs} style={{ width: "20px", height: "20px", marginLeft: "10px" }}
                        onClick={() => {
                            this.props.history.goBack()
                        }} />
                    <p style={{ color: "white", marginLeft: "20px" }}>{this.state.message}</p>
                    {(!this.state.previewImageStatuse) && <p style={{ color: "white", marginLeft: "auto", marginRight: "10px" }}>{window.countryName}</p>}
                </div>
                {(this.state.previewImageStatuse) && <div className="preview-button-container">
                    <Button
                        label="My photo is clear"
                        onClick={() => {
                            let { message } = this.state
                            if (message == "ID Card Front Capture Preview") {
                                this.setState({ message: "back of ID Card" })
                                this.setState({ previewImageStatuse: false })
                                window.FrontIDCardPath = this.state.IDDocImgURL
                            } else if (message == "passport Capture Preview") {
                                this.props.history.push('idmain')
                                window.PassportPath = this.state.IDDocImgURL
                            } else if (message == "Resident Front Capture Preview") {
                                this.setState({ message: "back of Resident permit" })
                                this.setState({ previewImageStatuse: false })
                                window.FrontResidentPath = this.state.IDDocImgURL
                            } else if (message == "ID Card Back Capture Preview") {
                                this.props.history.push('idmain')
                                window.BackIDCardPath = this.state.IDDocImgURL
                            } else if (message == "Resident Back Capture Preview") {
                                this.props.history.push('poadoc')
                                window.BackResidentPath = this.state.IDDocImgURL
                            }
                        }}
                    />
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
