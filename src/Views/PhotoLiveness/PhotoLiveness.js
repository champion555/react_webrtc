import React, { Component } from 'react';
import { withRouter } from "react-router";
import Header from "../../Components/header/header"
import captureImg from "../../assets/camera_take.png"
import Webcam from '../../Components/Webcam.react';
import UndetectImgURL from "../../assets/ic_undetected.png"
import DetectImgURL from "../../assets/ic_detected.png"
import LogoURL from "../../assets/ic_logo1.png"
import Button from "../../Components/button/button"
import { captureUserMedia} from '../../lib/BackUtils';
import { PhotoUpload } from '../../lib/AppUtils';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './PhotoLiveness.css';

const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);

class PhotoLiveness extends Component {
    constructor(props) {
        super(props);
        this.state = {
            frameHeight: window.innerHeight,
            captureImgSrc: captureImg,
            ImageURL: null,
            ImgSrc: UndetectImgURL,
            logoSrc:LogoURL,
            apiFlage: false

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
    }
    requestUserMedia() {
        console.log('requestUserMedia')
        captureUserMedia((stream) => {
            this.setState({ src: stream });
        });

        setInterval(() => {
            if (this.startTime) {
                var duration = new Date().getTime() - this.startTime;
                this.setState({ recordDuration: this.durationFormat(duration) });
            }

        }, 1000);
    }
    getImage() {
        this.setState({ ImgSrc: DetectImgURL })
        console.log("buttong clicked")
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
                // alert(response.result + response.score)
                this.props.history.push('iddocresult')

            } else if (response.result === "SPOOF") {
                // alert(response.result)
                window.livenessResult = response.result
                this.setState({ ImgSrc: UndetectImgURL })
                this.props.history.push('livenessresult')

            } else {
                // alert(response.result)
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
        return (
            <div>
                {(!this.state.apiFlage) && <Header headerText="Face Liveness" />}
                <div className="camera-container">
                    <Webcam src={this.state.src} ref={this.webcamRef} />
                    <canvas ref={this.captureRef} width="320" height="240" id="canvas" style={{ display: "none" }}></canvas>
                </div>
                <div className="frame-view">
                    <img src={this.state.ImgSrc} style={{ width: "100%", height: window.innerHeight}} />
                </div>
                <div className="liveness-captureButton" onClick={() => this.getImage()}>
                    <p style={{ font: "18px", color: "white", textAlign: "center" }}>Please place your face on the oval and take the photo </p>
                    <img src={this.state.captureImgSrc} className="captureIcon" />
                </div>
                {(this.state.apiFlage) && <div style={{ width: "100%", height: window.innerHeight, zIndex: 20, background: "#7f00ff", position: "absolute",textAlign:"center" }}>
                    <img src={this.state.logoSrc} style = {{width:"100px",marginTop:window.innerHeight - 100}}/>
                </div>}
                {(this.state.apiFlage) && <div className="loadingView" style = {{bottom:window.innerHeight * 0.5}}>
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
