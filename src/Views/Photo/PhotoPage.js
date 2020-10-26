import React from 'react';
import datauritoblob from 'datauritoblob'
import { captureUserMedia, VideoUpload, changeCamera, durationFormat } from '../../lib/AppUtils';
import Webcam from '../../Components/Webcam.react';
import RecordRTC, { MediaStreamRecorder } from 'recordrtc';
import Header from "../../Components/header/header"

import '../Video/VideoPage.css';

const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia || navigator.msGetUserMedia);

class PhotoPage extends React.Component {
  constructor(props) {
    super(props);

    this.startTime = new Date();
    this.state = {
      recordVideo: null,
      src: null,
      list: [],
      response: '',
      recording: false,
      uploadProgress: '',
      frameHeight: window.innerHeight - 50,
      uploadSuccess: null,
      uploading: false,
      uploadingPicture: false,
      description: 'Place your face inside the frame and press start button'
    };

    this.requestUserMedia = this.requestUserMedia.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);

    this.captureRef = React.createRef()
    this.imgRef = React.createRef()

    this.webcamRef = React.createRef()

  }
  updateDimensions = () => {
    this.setState({ frameHeight: window.innerHeight });
  };
  componentDidMount() {
    console.log(window.cameraMode)
    if (!hasGetUserMedia) {
      alert("Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.");
      return;
    }
    // window.addEventListener('resize', this.updateDimensions);
    this.requestUserMedia();
  }

  requestUserMedia() {
    console.log('requestUserMedia')
    // localStorage.setItem("cameraMode", "front")
    
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

  startRecord() {
    if (this.state.recording) {
      this.stopRecord();
      return
    }

    this.setState({ response: '', uploadProgress: '', })

    captureUserMedia((stream) => {
      const recordVideo = RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/mp4',
        recorderType: MediaStreamRecorder
      });//
      this.startTime = new Date().getTime()
      this.setState({ recordVideo }, () => {
        this.setState({ recording: true })
        this.state.recordVideo.startRecording();
      })
    });

    // setTimeout(() => {
    //   this.stopRecord();
    // }, 4000);
  }

  changeCamera(deviceId) {
    changeCamera(deviceId)
      .then(stream => {
        window.stream = stream;

        // var track = stream.getVideoTracks()[0];
        // // console.log(track.getSettings())
        // track.applyConstraints({
        //   advanced: [
        //     { focusMode: 'manual', focusDistance: 0.33 }
        //   ]
        // })

        this.setState({ src: stream });
      })
      .catch(e => {
        console.error(e)
      })

    // captureUserMedia((stream) => {
    //   console.log(stream)
    //   this.setState({ src: stream });
    //   // console.log('setting state', this.state)
    // }, deviceId);

  }

  toggleFullScreen = () => {
    var el = this.webcamRef.current.videoRef.current;

    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  };

  onFullScreen() {
    this.toggleFullScreen();
  }

  getImage() {

    this.setState({ response: '', uploadProgress: '', uploading: true })


    this.captureRef.current.setAttribute('width', this.webcamRef.current.videoRef.current.videoWidth)
    this.captureRef.current.setAttribute('height', this.webcamRef.current.videoRef.current.videoHeight)


    var context = this.captureRef.current.getContext('2d');

    console.log(this.webcamRef.current.videoRef.current.videoWidth, this.webcamRef.current.videoRef.current.videoHeight);


    console.error(this.captureRef.current.width, this.captureRef.current.height)

    var height = this.webcamRef.current.videoRef.current.videoHeight * (this.captureRef.current.width / this.webcamRef.current.videoRef.current.videoWidth);

    context.drawImage(this.webcamRef.current.videoRef.current, 0, 0, this.captureRef.current.width, height);

    var data = this.captureRef.current.toDataURL('image/jpeg');
    VideoUpload(data, false, (total, progress) => {
      // this.setState({ uploadProgress: parseInt(progress * 100 / total) + '  %' });
    })
      .then(r => {
        console.log(r)
        try {
          this.props.history.push({
            pathname: '/result',
            state: {
              score: parseFloat(r.data.score),
              threshold: parseFloat(r.data.threshold),
              message: r.data.message
            }
          });
        } catch (e) {
          console.error(e)
          this.setState({ uploading: false })
        }
      })
      .catch(e => {
        this.setState({ uploading: false })
        console.error(e)
      })
    this.imgRef.current.setAttribute('src', data);
  }

  stopRecord() {

    this.state.recordVideo.stopRecording(() => {

      this.setState({ recording: false, uploading: true, })

      // RecordRTC.invokeSaveAsDialog(this.state.recordVideo.blob, 'test.mp4')

      VideoUpload(this.state.recordVideo.blob, this.state.recordVideo,
        (total, progress) => {
          this.setState({ uploadProgress: parseInt(progress * 100 / total) + '  %' });
        })
        .then(r => {
          // this.setState({ uploadSuccess: true, uploading: false, response: JSON.stringify(r.data, null, 2) }, () => {
          //   this.props.onEnd(r.data)
          // });
          this.props.history.push({
            pathname: '/result',
            state: {
              score: parseFloat(r.data.score),
              threshold: parseFloat(r.data.threshold),

            }
          });

        })
        .catch(e => {
          console.error(e)
          this.setState({ uploadSuccess: false, uploading: false }, () => {

          });
        })

    });
  }

  render() {
    return (
      <>
        <div>
          <Header headerText="Photo Face Liveness" url="photo" />
        </div>
        <div className="parent" style={{ height: this.state.frameHeight }}>
          <Webcam src={this.state.src} ref={this.webcamRef} />
          <img ref={this.imgRef} alt="" style={{ display: 'none' }}/>
          <canvas ref={this.captureRef} width="320" height="240" id="canvas" style={{ display: 'none' }}></canvas>
          {/* <img src="../../assets/ic_undetected.png" alt="" className="framImg" /> */}
          <div style={{ height: this.state.frameHeight }} className="framImg"  ></div>
          <div className="description">{this.state.description}</div>
          
          <div id="container-circles">
            <div id="outer-circle" onClick={() => this.getImage()}>
              <div id="inner-circle" className={this.state.recording ? 'record' : ''}>
                {this.state.recording ? this.state.recordDuration : null}
                {this.state.recording ? null : this.state.uploadProgress}
              </div>
            </div>
            {this.state.uploading ? <div id="outer-border"></div> : null}
          </div>

        </div>
      </>
    )
  }
}

export default PhotoPage;

