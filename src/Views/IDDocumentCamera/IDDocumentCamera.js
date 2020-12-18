import React, { Component } from 'react';
import { withRouter } from "react-router";
import backURL from "../../assets/ic_back.png"
import captureURL from "../../assets/camera_take.png"
import errorURL from "../../assets/ic_error.png"
import idcardURL from "../../assets/ic_idcardframe.png"
import Button from "../../Components/button/button"
import ReTakeButton from "../../Components/bottomButton/bottomButton"
import Webcam from "react-webcam";

import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { check_blur, check_blur_base64, check_glare_base64, check_face_base64, check_glare, check_face } from 'image-analitic-lib'

import './IDDocumentCamera.css'

class IDDocumentCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backButtonSRC: backURL,
            captureButtonSRC: captureURL,
            errorSRC: errorURL,
            idCardSRC: idcardURL,
            IDTarget: "",
            message: "",
            titleMessage: "",
            idTitle: "",
            previewImageStatuse: false,
            isErrorStatus: false,
            screenshot: null,
            isCamSize: null,
            blurResult: null,
            glareResult: null,
            crop: {
                unit: '%',
                x: 5,
                y: 11,
                width: 90,
                height: 40.5,
                aspect: 16 / 9
            },
            croppedImageUrl: null
        }
    }
    componentDidMount = () => {
        if (window.innerHeight > 700) {
            this.setState({ isCamSize: true })
            this.setState({
                crop: {
                    unit: '%',
                    x: 5,
                    y: 15,
                    width: 90,
                    height: 45,
                    aspect: 16 / 9
                }
            })
        } else if (window.innerHeight < 600) {
            this.setState({ isCamSize: false })
            this.setState({
                crop: {
                    unit: '%',
                    x: 5,
                    y: 11,
                    width: 90,
                    height: 40.5,
                    aspect: 16 / 9
                }
            })
        }
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
        this.setState({ previewImageStatuse: true })
        let { IDTarget } = this.state
        if (IDTarget == "frontIDCard") {
            this.setState({ titleMessage: "Image preview" })
            this.setState({ message: "Make sure  the  document  is clear  to read" })
        } else if (IDTarget == "passport") {
            this.setState({ titleMessage: "Image preview" })
            this.setState({ message: "Make sure  the  document  is clear  to read" })
        } else if (IDTarget == "frontResident") {
            this.setState({ titleMessage: "Image preview" })
            this.setState({ message: "Make sure  the  document  is clear  to read" })
        } else if (IDTarget == "backIDCard") {
            this.setState({ titleMessage: "Image preview" })
            this.setState({ message: "Make sure  the  document  is clear  to read" })
        } else if (IDTarget == "backResident") {
            this.setState({ titleMessage: "Image preview" })
            this.setState({ message: "Make sure  the  document  is clear  to read" })
        }
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
    onLoadedImage() {

        var b = check_blur('imageID');
        var g = check_glare('imageID')
        var f = check_face('imageID')
        this.setState({blurResult: b.b})
        this.setState({glareResult:g})
        if (b.b == true || g == true) {
            this.setState({ isErrorStatus: true })
        }
        console.log(b)
        console.log(g)
    }

    setRef = webcam => {
        this.webcam = webcam;
    };
    onImageLoaded = (image) => {
        this.imageRef = image;
    };
    onCropComplete = (crop) => {
        this.makeClientCrop(crop);
    };
    onCropChange = (crop, percentCrop) => {
        this.setState({ crop });
    };
    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                "newFile.jpeg"
            );
            this.setState({ croppedImageUrl: croppedImageUrl });
        }
    }
    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error("Canvas is empty");
                    return;
                }
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, "image/jpeg");
        });
    }

    render() {
        const videoConstraints = {
            facingMode: "environment"
        };
        return (
            <div style={{ width: "100%", height: window.innerHeight }}>
                <div style={{ textAlign: "center", zIndex: "1", position: 'absolute' }}>
                    <img id="imageID" src={this.state.croppedImageUrl} onLoad={() => this.onLoadedImage()} />
                </div>
                <div className="IDCamera-Container">
                    {(!this.state.previewImageStatuse) && (this.state.isCamSize) && <Webcam
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
                    {(this.state.previewImageStatuse) && (this.state.isCamSize) && <ReactCrop
                        src={this.state.screenshot}
                        crop={this.state.crop}
                        ruleOfThirds
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onCropComplete}
                        onChange={this.onCropChange}
                    />}

                    {(!this.state.previewImageStatuse) && (!this.state.isCamSize) && <Webcam
                        audio={false}
                        mirrored={false}
                        ref={this.setRef}
                        screenshotFormat="image/jpeg"
                        imageSmoothing={true}
                        width={"100%"}
                        height={window.innerHeight - 50}
                        screenshotQuality={1.0}
                        videoConstraints={videoConstraints}
                        forceScreenshotSourceSize="flase"
                    />}
                    {(this.state.previewImageStatuse) && (!this.state.isCamSize) && <ReactCrop
                        src={this.state.screenshot}
                        crop={this.state.crop}
                        ruleOfThirds
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onCropComplete}
                        onChange={this.onCropChange}
                        imageStyle={{ height: window.innerHeight - 50 }}

                    />}

                </div>
                <div style={{ zIndex: "20", position: "absolute", width: "100%", height: window.innerHeight }}>
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
                    <div style={{ height: window.innerHeight * 0.44, backgroundImage: `url(${this.state.idCardSRC})`, backgroundSize: "100% 100%" }}/>
                     
                    <div style={{ height: window.innerHeight * 0.49, background: "#7f00ff" }}>
                        <div className="IDMessage-Container" style={{ height: window.innerHeight * 0.15 }}>
                            <p className="IDTitle" >{this.state.idTitle}</p>
                            <p className="IDDocCamMeassage">{this.state.message}</p>
                        </div>
                        {(this.state.isErrorStatus) && <div className="errorMessageView" style={{ bottom: window.innerHeight * 0.13 }}>
                            <div className="container">
                                <div className="errortitle">
                                    <img src={this.state.errorSRC} />
                                    <p>The image quality is very low</p>
                                </div>
                                <div className="errormessage">
                                    {(this.state.blurResult) && <p>- The image  is blurry!</p>}
                                    {(this.state.glareResult) && <p>- The image  contains glares </p>}
                                </div>
                            </div>
                        </div>}
                        {(!this.state.previewImageStatuse) && <div className="IDCapture-Container" style={{ marginTop: window.innerHeight * 0.11 }}>                            
                            {(!this.state.isLoading) && <Button
                                label="Take A Picture"
                                onClick={this.onCapture}
                            />}
                            <p className="bottomTitle">powerd by BIOMIID</p>
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
                                        // window.FrontIDCardPath = this.state.IDDocImgURL
                                        window.FrontIDCardPath = this.state.croppedImageUrl
                                        // localStorage.setItem("FrontIDCardPath", this.state.IDDocImgURL)                    
                                    } else if (IDTarget == "passport") {
                                        this.props.history.push('idmain')
                                        window.PassportPath = this.state.croppedImageUrl
                                        window.PassportCountry = window.countryName
                                        // localStorage.setItem("PassportPath", this.state.IDDocImgURL)
                                        // localStorage.setItem("passportCountry",window.countryName)
                                    } else if (IDTarget == "frontResident") {
                                        this.setState({ IDTarget: "backResident" })
                                        this.setState({ titleMessage: "Residence Permit Card" })
                                        this.setState({ idTitle: "Back of Residence Permit" })
                                        this.setState({ message: "Place the back of Residence Permit Card inside the frame and take the photo" })
                                        this.setState({ previewImageStatuse: false })
                                        window.FrontResidentPath = this.state.croppedImageUrl
                                        // localStorage.setItem("FrontResidentPath", this.state.IDDocImgURL)                                
                                    } else if (IDTarget == "backIDCard") {
                                        this.props.history.push('idmain')
                                        window.BackIDCardPath = this.state.croppedImageUrl
                                        window.IDCardCountry = window.countryName
                                        // localStorage.setItem("BackIDCardPath", this.state.IDDocImgURL)
                                        // localStorage.setItem("idCardCountry",window.countryName)
                                    } else if (IDTarget == "backResident") {
                                        this.props.history.push('poadoc')
                                        window.BackResidentPath = this.state.croppedImageUrl
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