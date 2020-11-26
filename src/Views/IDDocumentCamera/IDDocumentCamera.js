import React, { Component } from 'react';
import { withRouter } from "react-router";
import backURL from "../../assets/ic_back.png"
import captureURL from "../../assets/camera_take.png"
import errorURL from "../../assets/ic_error.png"
import Button from "../../Components/button/button"
import ReTakeButton from "../../Components/bottomButton/bottomButton"
import Webcam from "react-webcam";
import { ImageQuality } from '../../lib/AppUtils';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './IDDocumentCamera.css'

class IDDocumentCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backButtonSRC: backURL,
            captureButtonSRC: captureURL,
            errorSRC: errorURL,
            IDTarget: "",
            message: "",
            titleMessage: "",
            idTitle: "",
            previewImageStatuse: false,
            isErrorStatus: false,
            screenshot: null,
            isLoading: false,
        }
    }
    componentDidMount = () => {
        console.log(window.countryName)
        console.log(window.IDType)
        console.log(window.cameraMode)
        this.onSetMessage()
    }
    onSetMessage = () => {
        if (window.IDType == "idcard") {
            this.setState({ IDTarget: "frontIDCard" })
            this.setState({ message: "Place the front of National ID Card inside the frame and take the photo" })
            this.setState({ titleMessage: "National ID Card" })
            this.setState({ idTitle: "Front of National ID Card" })
        } else if (window.IDType == "passport") {
            this.setState({ IDTarget: "passport" })
            this.setState({ idTitle: "Passport" })
            this.setState({ message: "Place the Passport inside the frame amd take the photo" })
            this.setState({ titleMessage: "Passport" })
        } else if (window.IDType == "resident") {
            this.setState({ IDTarget: "frontResident" })
            this.setState({ idTitle: "Front of Residence Permit Card" })
            this.setState({ message: "Place the front of Residence Permit Card inside the frame and take the photo" })
            this.setState({ titleMessage: "Residence Permit Card" })
        }
    }
    onCapture = () => {
        const imageSrc = this.webcam.getScreenshot();
        this.setState({ screenshot: imageSrc })
        console.log(imageSrc)
        // this.setState({isLoading: true})
        this.setState({ previewImageStatuse: true })
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
        // ImageQuality(imageSrc, (total, progress) => {
        // }).then(res => {
        //     var response = res.data;
        //     console.log(response, response.message, response.errorList);
        //     this.setState({ previewImageStatuse: true })
        //     this.setState({ isLoading: false })
        //     if (response.statusCode == "200") {
        //         let { IDTarget } = this.state
        //         if (IDTarget == "frontIDCard") {
        //             this.setState({ titleMessage: "Image preview" })
        //             this.setState({ message: "Make sure the ID Docment image is clear to read" })
        //         } else if (IDTarget == "passport") {
        //             this.setState({ titleMessage: "Image preview" })
        //             this.setState({ message: "Make sure the ID Docment image is clear to read" })
        //         } else if (IDTarget == "frontResident") {
        //             this.setState({ titleMessage: "Image preview" })
        //             this.setState({ message: "Make sure the ID Docment image is clear to read" })
        //         } else if (IDTarget == "backIDCard") {
        //             this.setState({ titleMessage: "Image preview" })
        //             this.setState({ message: "Make sure the ID Docment image is clear to read" })
        //         } else if (IDTarget == "backResident") {
        //             this.setState({ titleMessage: "Image preview" })
        //             this.setState({ message: "Make sure the ID Docment image is clear to read" })
        //         }
        //     } else {
        //         this.setState({ titleMessage: "Image preview" })
        //         this.setState({ message: "Make sure the ID Docment image is clear to read" })
        //         this.setState({ isErrorStatus: true })

        //     }

        // }).catch(e => {
        //     alert("The server is not working or the network error, Please try again.");
        //     this.setState({ isLoading: false })
        // })

    };
    onReTake = () => {
        this.setState({ previewImageStatuse: false })
        this.setState({ isErrorStatus: false })
        let { IDTarget } = this.state
        if (IDTarget == "frontIDCard") {
            this.setState({ message: "Place the front of National ID Card inside the frame and take the photo" })
            this.setState({ titleMessage: "National of ID Card" })
        } else if (IDTarget == "passport") {
            this.setState({ message: "Place the Passport inside the frame and take the photo" })
            this.setState({ titleMessage: "Passport" })
        } else if (IDTarget == "frontResident") {
            this.setState({ message: "Place the front of Residence Permit Card inside the frame and take the photo" })
            this.setState({ titleMessage: "Residencd Permit Card" })
        } else if (IDTarget == "backIDCard") {
            this.setState({ message: "Place the back of National ID Card inside the frame and take the photo" })
            this.setState({ titleMessage: "National of ID Card" })
        } else if (IDTarget == "backResident") {
            this.setState({ message: "Place the back of Residence Permit Card inside the frame and take the photo" })
            this.setState({ titleMessage: "Residence Permit Card" })
        }
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
                <div className="IDCamera-Container">
                    {(!this.state.previewImageStatuse) && <Webcam
                        audio={false}
                        mirrored={false}
                        ref={this.setRef}
                        screenshotFormat="image/jpeg"
                        imageSmoothing={true}
                        width={"100%"}
                        screenshotQuality={1.0}
                        videoConstraints={videoConstraints}
                        forceScreenshotSourceSize="flase"
                    />}
                    {(this.state.previewImageStatuse) && <img className="PreviewImage" src={this.state.screenshot} style={{ height: this.state.screenshot.innerHeight }} />}
                </div>
                <div style={{ zIndex: "2", position: "absolute", width: "100%", height: window.innerHeight }}>
                    <div style={{ height: window.innerHeight * 0.07, background: "#7f00ff" }}>
                        <div style={{ width: "100%", height: window.innerHeight * 0.07, alignItems: "center", display: "flex", background: "" }}>
                            <img src={this.state.backButtonSRC} style={{ width: "20px", height: "20px", marginLeft: "10px" }}
                                onClick={() => {
                                    this.props.history.goBack()
                                }} />
                            <p style={{ color: "white", marginLeft: "20px", fontWeight: "bold", fontSize: "20px" }}>{this.state.titleMessage}</p>
                            <p style={{ color: "white", marginLeft: "auto", marginRight: "10px" }}>{window.countryName}</p>
                        </div>
                    </div>
                    <div style={{ height: window.innerHeight * 0.48,position:"relative"}}>
                        <div style = {{height:window.innerHeight*0.03,background:"#7f00ff",opacity:"0.6"}}></div>
                        <div style = {{height:window.innerHeight*0.42,display:"flex",flexDirection:"row"}}>
                            <div style = {{width:"3%",height:window.innerHeight*0.42, background:"#7f00ff",opacity:"0.6"}}></div>
                            <div style = {{width:"94%",height:window.innerHeight*0.42 - 4,border:"solid", borderColor:"white",zIndex:"10"}}></div>
                            <div style = {{width:"3%",height:window.innerHeight*0.42,background:"#7f00ff",opacity:"0.6"}}></div>
                        </div>
                        <div style = {{height:window.innerHeight*0.03,background:"#7f00ff",opacity:"0.6"}}></div>
                    </div>
                    <div style={{ height: window.innerHeight * 0.45, background: "#7f00ff" }}>
                        <div className="IDMessage-Container" style={{ height: window.innerHeight * 0.15 }}>
                            <p className="IDTitle" >{this.state.idTitle}</p>
                            <p className="IDDocCamMeassage">{this.state.message}</p>
                        </div>
                        {/* {(this.state.isErrorStatus) && <div className="errorMessageView" style={{ bottom: window.innerHeight * 0.13 }}>
                            <div className="container">
                                <div className="errortitle">
                                    <img src={this.state.errorSRC} />
                                    <p>The image quality is very low</p>
                                </div>
                                <div className="errormessage">
                                    <p>- Make sure the image is not blurry or contains blares!</p>
                                </div>
                            </div>
                        </div>} */}
                        {(!this.state.previewImageStatuse) && <div className="IDCapture-Container" style={{ height: window.innerHeight * 0.3}}>
                            {/* {(this.state.isLoading) && <div style={{ height: "50px", width: "100%", marginBottom: "20px", textAlign: "center" }}>
                                <Loader
                                    type="Circles"
                                    color="#ffffff"
                                    height={40}
                                    width={40}
                                />
                            </div>} */}
                            {/* {(!this.state.isLoading) && <Button
                                label="Take A Picture"
                                onClick={this.onCapture}
                            />}
                            <p className="bottomTitle">powerd by BIOMIID</p> */}
                        </div>}
                        {(this.state.previewImageStatuse) && <div className="ButtonPreview">
                            {(!this.state.isErrorStatus) && <Button
                                label="My photo is clear"
                                onClick={() => {
                                    let { IDTarget } = this.state
                                    if (IDTarget == "frontIDCard") {
                                        this.setState({ IDTarget: "backIDCard" })
                                        this.setState({ titleMessage: "National ID Card" })
                                        this.setState({ idTitle: "Back of National ID Card" })
                                        this.setState({ message: "Place the back page of ID Card inside the frame and take the photo" })
                                        this.setState({ previewImageStatuse: false })
                                        window.FrontIDCardPath = this.state.IDDocImgURL
                                        // localStorage.setItem("FrontIDCardPath", this.state.IDDocImgURL)                    
                                    } else if (IDTarget == "passport") {
                                        this.props.history.push('idmain')
                                        window.PassportPath = this.state.IDDocImgURL
                                        window.PassportCountry = window.countryName
                                        // localStorage.setItem("PassportPath", this.state.IDDocImgURL)
                                        // localStorage.setItem("passportCountry",window.countryName)
                                    } else if (IDTarget == "frontResident") {
                                        this.setState({ IDTarget: "backResident" })
                                        this.setState({ titleMessage: "Residence Permit Card" })
                                        this.setState({ idTitle: "Back of Residence Permit" })
                                        this.setState({ message: "Place the back of Residence Permit Card inside the frame and take the photo" })
                                        this.setState({ previewImageStatuse: false })
                                        window.FrontResidentPath = this.state.IDDocImgURL
                                        // localStorage.setItem("FrontResidentPath", this.state.IDDocImgURL)                                
                                    } else if (IDTarget == "backIDCard") {
                                        this.props.history.push('idmain')
                                        window.BackIDCardPath = this.state.IDDocImgURL
                                        window.IDCardCountry = window.countryName
                                        // localStorage.setItem("BackIDCardPath", this.state.IDDocImgURL)
                                        // localStorage.setItem("idCardCountry",window.countryName)
                                    } else if (IDTarget == "backResident") {
                                        this.props.history.push('poadoc')
                                        window.BackResidentPath = this.state.IDDocImgURL
                                        window.ResidentCountry = window.countryName
                                        // localStorage.setItem("BackResidentPath", this.state.IDDocImgURL)
                                        // localStorage.setItem("residentCountry",window.countryName)
                                    }
                                }}
                            />}
                            <ReTakeButton
                                label="Re-take"
                                onClick={this.onReTake}
                            />
                        </div>}
                    </div>
                </div>

            </div>
        )
    }
}

export default withRouter(IDDocumentCamera);