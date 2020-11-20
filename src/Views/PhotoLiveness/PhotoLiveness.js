import React, { Component } from 'react';
import { withRouter } from "react-router";
import Header from "../../Components/header/header"
import captureImg from "../../assets/camera_take.png"
import Webcam from '../../Components/Webcam.react';
import frameURL from "../../assets/ic_undetected.png"
import Button from "../../Components/button/button"
// import { captureUserMedia, VideoUpload, changeCamera, durationFormat } from '../../lib/BackUtils';
import { ImageQuality } from '../../lib/AppUtils';
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
            frameSrc: frameURL,
            message: "",
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
        let frontCam = this.state.facingMode
        this.captureUserMedia((stream, frontCam) => {
            this.setState({ src: stream });
        });

        setInterval(() => {
            if (this.startTime) {
                var duration = new Date().getTime() - this.startTime;
                this.setState({ recordDuration: this.durationFormat(duration) });
            }

        }, 1000);
    }

    captureUserMedia(callback, deviceId, facingMode) { 
        var params = {
          audio: false, video: {
            deviceId: deviceId ? { deviceId: { exact: deviceId } } : null,
            width: { exact: 1280 },
            height: { exact: 720 },
            facingMode: { exact: 'user' },
          }
        }; 
      navigator.getUserMedia(params, callback, (error) => {
        // alert(JSON.stringify(error));
      });
    }

    durationFormat(mili) {
      var fixedNum = (num) => {
          return ("0" + num).slice(-2);
        };
      let x = mili > 0 ? mili : 0;
      x = x / 1000;
      x = Math.floor(x);
      const secs = x % 60;
    
      x = x / 60;
      x = Math.floor(x);
      const mins = x % 60;
    
      x = x / 60;
      x = Math.floor(x);
    
      let h = x % 24;
      x = x / 24
      x = Math.floor(x);
    
      return `${fixedNum(h)}:${fixedNum(mins)}:${fixedNum(secs)}`
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

        // ImageQuality(data, (total, progress) => {
        // }).then(res => {
        //     var response = res.data;
        //     console.log(response, response.message, response.errorList);
        //     this.setState({ previewImageStatuse: true })
        //     this.setState({ frontCard: true })
        //     this.setState({ ImageURL: data })
        //     if (response.statusCode == "200") {
        //         this.setState({ isErrorStatus: false })
        //     } else {
        //         this.setState({ isErrorStatus: true })
        //     }
        // }).catch(e => {

        //     alert("image checking failed, Please try again.");

        // })

    }
    render() {
        return (
            <div>
                <Header headerText="Face Liveness" />
                <div className="camera-container">
                    <Webcam src={this.state.src} ref={this.webcamRef} />
                    <canvas ref={this.captureRef} width="320" height="240" id="canvas" style={{ display: "none" }}></canvas>
                </div>
                <div className="frame-view">
                    <img src={this.state.frameSrc} style={{ width: "100%", height: window.innerHeight }} />
                </div>
                <div className="liveness-captureButton" onClick={() => this.getImage()}>
                    <img src={this.state.captureImgSrc} className="captureIcon" />
                </div>
            </div>
        )
    }
}

export default withRouter(PhotoLiveness);
