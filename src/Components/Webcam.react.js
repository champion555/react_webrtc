import React from 'react';
import '../App.css';
class Webcam extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef()
    this.state = {
      frameHeight: window.innerHeight,
      faceMode:  window.cameraMode,
      
    }
  }

  componentDidMount() {

    this.setSrc()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.src !== this.props.src) {
      this.setSrc()
    }
  }

  setSrc = () => {
    this.videoRef.current.srcObject = this.props.src
    this.videoRef.current.play()
  }

  render() {
    return (
      <video ref={this.videoRef} autoPlay muted width="100%" style={{ height: this.state.frameHeight, transform:`${this.state.faceMode == 'front'?'rotateY(180deg)':''}` }} />
    )
  }
}

export default Webcam;
