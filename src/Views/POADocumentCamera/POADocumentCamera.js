import React, { Component } from 'react';
import { withRouter } from "react-router";
import Webcam from "react-webcam";
import Button from "../../Components/button/button"
import Header from "../../Components/header/header"
import errorURL from "../../assets/ic_error.png"
import Loader from 'react-loader-spinner'
import { ImageQuality } from '../../lib/AppUtils';
import './POADocumentCamera.css'

class POADocumentCamera extends Component {
    constructor(props) {
        super(props);
        this.onCapture = this.onCapture.bind(this)
        this.state = {
            screenshot: null,
            errorIconURL: errorURL,
            previewImageStatuse: false,
            isErrorStatus: false,
            isLoading:false
        }
    }
    componentDidMount = () => {

    }
    onCapture = () => {
        const imageSrc = this.webcam.getScreenshot();
        this.setState({ screenshot: imageSrc })
        console.log(this.state.screenshot)
        this.setState({isLoading: true})

        ImageQuality(imageSrc, (total, progress) => {
        }).then(res => {
            var response = res.data;
            console.log(response, response.message, response.errorList);
            this.setState({ previewImageStatuse: true })
            this.setState({isLoading: false})
            if (response.statusCode == "200") {
                this.setState({ isErrorStatus: false })
            } else {
                this.setState({ isErrorStatus: true })
            }
        }).catch(e => {
            alert("The server is not working or the network error, Please try again.");
            this.setState({isLoading: false})
        })
    };
    onReTake = () => {
        this.setState({ previewImageStatuse: false })
        this.setState({ isErrorStatus: false })
    }
    setRef = webcam => {
        this.webcam = webcam;
    };
    render() {
        const videoConstraints = {
            facingMode: "environment"
        };
        return (
            <div style={{ width: "100%", height: window.innerHeight }}>
                <Header headerText="Scan PoA Document" />
                <div className="POADocumentCamera-Container" style={{ height: window.innerHeight - 50 }}>
                    {(!this.state.previewImageStatuse) && <Webcam
                        audio={false}
                        mirrored={true}
                        mirrored={false}
                        ref={this.setRef}
                        screenshotFormat="image/jpeg"
                        imageSmoothing={true}
                        width={"90%"}
                        height={window.innerHeight - 50}
                        screenshotQuality={1.0}
                        videoConstraints={videoConstraints}
                        forceScreenshotSourceSize="flase" />}
                    {(this.state.previewImageStatuse) && <img className="PreviewImage" src={this.state.screenshot} style={{ height: window.innerHeight - 50 }} />}
                </div>
                <div style={{ width: "100%", height: window.innerHeight - 50, position: "absolute", zIndex: "2" }}>
                    {(this.state.isErrorStatus) && <div className="POAErrorMessageView" style={{ marginTop: window.innerHeight * 0.5 }}>
                        <div className="container">
                            <div className="errortitle">
                                <img src={this.state.errorIconURL} />
                                <p>The image quality is very low</p>
                            </div>
                            <div className="errormessage">
                                <p>- Make sure the image is not blurry or contains blares!</p>
                            </div>
                        </div>
                    </div>}
                    {(this.state.isLoading) &&  <div style={{ height: "50px", width: "100%",marginTop:window.innerHeight*0.6, textAlign: "center" }}>
                        <Loader
                            type="Circles"
                            color="#ffffff"
                            height={40}
                            width={40}
                        />
                    </div>}
                    {(!this.state.previewImageStatuse) && <div className="POACapture-Container">
                        {(!this.state.isLoading) && <Button
                            label="POA Document Scan"
                            onClick={this.onCapture}
                        />}
                        <p className="bottomTitle">powerd by BIOMIID</p>
                    </div>}
                    {(this.state.previewImageStatuse) && <div className="POAPreviewButton-Container">
                        {(!this.state.isErrorStatus) && <Button
                            label="My photo is clear"
                            onClick={() => {
                                window.POADocPath = this.state.ImageURL
                                this.props.history.push('photoliveness')
                            }}
                        />}
                        <Button
                            label="Re-take"
                            onClick={this.onReTake}
                        />
                    </div>}
                </div>


            </div>
        )
    }
}

export default withRouter(POADocumentCamera);