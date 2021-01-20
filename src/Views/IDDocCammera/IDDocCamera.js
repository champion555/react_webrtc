import React, { Component, createRef } from 'react';
import { withRouter } from "react-router";
import backURL from "../../assets/ic_cancel_white.png"
import captureURL from "../../assets/camera_take.png"
import errorURL from "../../assets/ic_error.png"
import idcardURL from "../../assets/ic_idcardframe.png"
import Button from "../../Components/button/button"
import ExitButton from '../../Components/button/button'
import ContinueButton from "../../Components/POAButton/POAButton"
import ReTakeButton from "../../Components/button/button"
import Webcam from "react-webcam";
import { Camera } from "react-camera-pro";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { check_blur, check_blur_base64, check_glare_base64, check_face_base64, check_glare, check_face } from 'image-analitic-lib'
import { initMRZ } from 'image-analitic-lib'
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './IDDocCamera.css'
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'
let lan = localStorage.getItem('language');
setDefaultLanguage(lan)

var openWindow;

class Result extends Component {
    constructor(props) {
        super(props);
        this.webcamRef = React.createRef();
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
            blurValue: null,
            glareResult: null,
            faceResult: null,
            isMrzDetected: null,
            txtColor: "white",
            backgroundColor: "#7f00ff",
            modalOpen: false,
            crop: {
                unit: '%',
                x: 0,
                y: 10,
                width: 100,
                height: 38,
                aspect: 16 / 9
            },
            croppedImageUrl: null,
            croppedImageBase64: null,
            mrzDetectFlag: false,
            isMrzProcessing: false,
            isMrzLoading: false,
            cameraRatio: null,

        }
        this.MrzDetector = initMRZ(Worker);
        this.MrzDetector.on('error', (e) => {
            console.error(e)
            console.log("mrz progressing is error lol!")
        })
        this.MrzDetector.on('result', (cardInfo) => {
            console.error(cardInfo)
            this.setState({ isMrzLoading: false })
            try {
                if (cardInfo != null) {
                    this.setState({ isMrzProcessing: true })
                    console.log(cardInfo.type)
                    console.log(cardInfo.recognization)
                    console.log(cardInfo.country)

                    switch (this.state.IDTarget) {
                        case "frontIDCard":
                            if (this.state.blurResult || this.state.glareResult || this.state.faceResult == false) {
                                this.setState({ isErrorStatus: true })
                                this.setState({ isMrzDetected: false })
                            } else {
                                this.setState({ isErrorStatus: false })
                            }
                            if (cardInfo.recognization) {
                                this.setState({ mrzDetectFlag: true })
                            } else {
                                this.setState({ mrzDetectFlag: false })
                            }
                            break;
                        case "passport":
                            if (this.state.blurResult || this.state.glareResult || this.state.faceResult == false || cardInfo.recognization == false) {
                                this.setState({ isErrorStatus: true })
                                if (cardInfo.recognization == false) {
                                    this.setState({ isMrzDetected: true })
                                } else {
                                    this.setState({ isMrzDetected: false })
                                }

                            } else {
                                this.setState({ isErrorStatus: false })
                            }
                            break;
                        case "frontResident":
                            if (this.state.blurResult || this.state.glareResult || this.state.faceResult == false) {
                                this.setState({ isErrorStatus: true })
                                this.setState({ isMrzDetected: false })
                            } else {
                                this.setState({ isErrorStatus: false })
                            }

                            if (cardInfo.recognization) {
                                this.setState({ mrzDetectFlag: true })
                            } else {
                                this.setState({ mrzDetectFlag: false })
                            }
                            break;
                        case "backIDCard":
                            this.setState({ faceResult: true })
                            if (this.state.blurResult || this.state.glareResult) {
                                this.setState({ isErrorStatus: true })
                                if (this.state.mrzDetectFlag || cardInfo.recognization) {
                                    this.setState({ isMrzDetected: false })
                                } else {
                                    this.setState({ isMrzDetected: true })
                                }
                            } else {
                                if (this.state.mrzDetectFlag || cardInfo.recognization) {
                                    this.setState({ isErrorStatus: false })
                                    this.setState({ isMrzDetected: false })
                                } else {
                                    this.setState({ isErrorStatus: true })
                                    this.setState({ isMrzDetected: true })
                                }
                            }
                            break;
                        case "backResident":
                            this.setState({ faceResult: true })
                            if (this.state.blurResult || this.state.glareResult) {
                                this.setState({ isErrorStatus: true })
                                if (this.state.mrzDetectFlag || cardInfo.recognization) {
                                    this.setState({ isMrzDetected: false })
                                } else {
                                    this.setState({ isMrzDetected: true })
                                }
                            } else {
                                if (this.state.mrzDetectFlag || cardInfo.recognization) {
                                    this.setState({ isMrzDetected: false })
                                    this.setState({ isErrorStatus: false })
                                } else {
                                    this.setState({ isMrzDetected: true })
                                    this.setState({ isErrorStatus: true })
                                }
                            }
                            break;
                        default:
                            console.log("dddd")
                            break;
                    }

                } else {
                    console.log("card information is null")
                    alert("MRZ Detection is error, please try again.")
                }
            } catch (e) {
                alert("MRZ Detection is error, please try again.")
                console.error(e)
            }
        })
    }
    componentDidMount = () => {
        const ratio = window.innerWidth / window.innerHeight
        this.setState({ cameraRatio: ratio })
        console.log(window.countryName)
        console.log(window.IDType)
        console.log(window.cameraMode)
        console.log(window.surpportedDocType)
        this.onSetMessage()
    }
    onSetMessage = () => {
        if (window.IDType == "idcard") {
            this.setState({ IDTarget: "frontIDCard" })
            this.setState({ message: t('idDocumentCamera.frontIDMes') })
            this.setState({ titleMessage: t('idDocumentCamera.idTitle') })
            this.setState({ idTitle: t('idDocumentCamera.frontIDTitle') })
        } else if (window.IDType == "passport") {
            this.setState({ IDTarget: "passport" })
            this.setState({ idTitle: t('idDocumentCamera.passportTitle') })
            this.setState({ message: t('idDocumentCamera.passportMes') })
            this.setState({ titleMessage: t('idDocumentCamera.passportTitle') })
        } else if (window.IDType == "resident") {
            this.setState({ IDTarget: "frontResident" })
            this.setState({ idTitle: t('idDocumentCamera.frontResidentTitle') })
            this.setState({ message: t('idDocumentCamera.frontResidentMes') })
            this.setState({ titleMessage: t('idDocumentCamera.residentTitle') })
        }
    }
    onCapture = () => {
        const imageSrc = this.webcamRef.current.takePhoto()
        this.setState({ screenshot: imageSrc })
        this.setState({ isMrzLoading: true })
        this.setState({ previewImageStatuse: true })
        let { IDTarget } = this.state
        if (IDTarget == "frontIDCard") {
            this.setState({ titleMessage: t('idDocumentCamera.previewTitle') })
            this.setState({ message: t('idDocumentCamera.previewMes') })
        } else if (IDTarget == "passport") {
            this.setState({ titleMessage: t('idDocumentCamera.previewTitle') })
            this.setState({ message: t('idDocumentCamera.previewMes') })
        } else if (IDTarget == "frontResident") {
            this.setState({ titleMessage: t('idDocumentCamera.previewTitle') })
            this.setState({ message: t('idDocumentCamera.previewMes') })
        } else if (IDTarget == "backIDCard") {
            this.setState({ titleMessage: t('idDocumentCamera.previewTitle') })
            this.setState({ message: t('idDocumentCamera.previewMes') })
        } else if (IDTarget == "backResident") {
            this.setState({ titleMessage: t('idDocumentCamera.previewTitle') })
            this.setState({ message: t('idDocumentCamera.previewMes') })
        }
    }
    onReTake = () => {
        this.setState({ previewImageStatuse: false })
        this.setState({ isErrorStatus: false })
        this.setState({ isMrzLoading: false })
        this.setState({ isMrzProcessing: false })

        this.setState({ blurResult: false })
        this.setState({ glareResult: false })
        this.setState({ faceResult: false })

        let { IDTarget } = this.state
        if (IDTarget == "frontIDCard") {
            if (this.mrzDetectFlag) {
                this.setState({ mrzDetectFlag: false })
            }
            this.setState({ message: t('idDocumentCamera.frontIDMes') })
            this.setState({ titleMessage: t('idDocumentCamera.idTitle') })
        } else if (IDTarget == "passport") {
            if (this.mrzDetectFlag) {
                this.setState({ mrzDetectFlag: false })
            }
            this.setState({ message: t('idDocumentCamera.passportMes') })
            this.setState({ titleMessage: t('idDocumentCamera.passportTitle') })
        } else if (IDTarget == "frontResident") {
            if (this.mrzDetectFlag) {
                this.setState({ mrzDetectFlag: false })
            }
            this.setState({ message: t('idDocumentCamera.frontResidentMes') })
            this.setState({ titleMessage: t('idDocumentCamera.residentTitle') })
        } else if (IDTarget == "backIDCard") {
            this.setState({ message: t('idDocumentCamera.backIDMes') })
            this.setState({ titleMessage: t('idDocumentCamera.idTitle') })
        } else if (IDTarget == "backResident") {
            this.setState({ message: t('idDocumentCamera.backResidentMes') })
            this.setState({ titleMessage: t('idDocumentCamera.residentTitle') })
        }
    }
    async onLoadedImage() {
        //get base64 string of croped image 
        var canvas = document.createElement("canvas");
        canvas.width = document.getElementById("imageID").width;
        canvas.height = document.getElementById("imageID").height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(document.getElementById("imageID"), 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        this.setState({ croppedImageBase64: dataURL });
        // check MRZ code from croped image
        this.MrzDetector.detectPassport(dataURL)
        // check image quality from croped image
        var b = check_blur('imageID');
        var g = check_glare('imageID')
        var f = await check_face('imageID')
        this.setState({ blurResult: b.b })
        this.setState({ blurValue: b.value })
        this.setState({ glareResult: g })
        this.setState({ faceResult: f.f })

        console.log(b)
        console.log(g)
        console.log(f.f)
    }
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
    onOpenModal = () => {
        console.log("sadf")
        this.setState({ modalOpen: true })
    }
    onCloseModal = () => {
        this.setState({ modalOpen: false })
    }
    onEXit = () => {
        this.props.history.push('')
    }
    render() {
        return (
            <div style={{ width: "100%", height: window.innerHeight }}>
                <div style={{ position: "absolute", zIndex: "-10", top: "0px" }}>
                    <img id="imageID" src={this.state.croppedImageUrl} onLoad={() => this.onLoadedImage()} />
                    <canvas id="myCanvas" />
                </div>
                {(!this.state.previewImageStatuse) && <div>
                    <Camera
                        ref={this.webcamRef}
                        aspectRatio={this.state.cameraRatio}
                        facingMode={"environment"} />
                </div>}
                {(this.state.previewImageStatuse) && <div className="IDDocCamCrop-container" style={{ height: window.innerHeight }}>
                    <ReactCrop
                        src={this.state.screenshot}
                        crop={this.state.crop}
                        ruleOfThirds
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onCropComplete}
                        onChange={this.onCropChange}
                    />
                </div>}
                <div className="IDDocCam-MainContainer" style={{ height: window.innerHeight }}>
                    <div style={{ height: window.innerHeight * 0.07, background: this.state.backgroundColor,opacity:"0.8" }}>
                        <div style={{ width: "100%", height: window.innerHeight * 0.07, alignItems: "center", display: "flex", background: "" }}>
                            <img src={this.state.backButtonSRC} style={{ width: "15px", height: "15px", marginLeft: "10px" }}
                                onClick={this.onOpenModal} />
                            <p style={{ width:"60%", color: this.state.txtColor, marginLeft: "10px", fontWeight: "bold", fontSize: "18px", marginBottom: "0px" }}>{this.state.idTitle}</p>
                            <p style={{ color: this.state.txtColor, marginLeft: "auto", marginRight: "10px" }}>{window.countryName}</p>
                        </div>
                    </div>
                    <div style={{ height: window.innerHeight * 0.44, display: "flex", backgroundImage: `url(${this.state.idCardSRC})`, backgroundSize: "100% 100%" }} >
                        {this.state.isMrzLoading && <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Loader
                                type="Puff"
                                color="#7f00ff"
                                height={60}
                                width={60}
                            />
                        </div>}
                    </div>
                    <div style={{ height: window.innerHeight * 0.49, background: this.state.backgroundColor,opacity:"0.8" }}>
                        <div className="IDMessage-Container" >
                            {/* <p className="IDTitle" style={{ color: this.state.txtColor }}>{this.state.idTitle}</p> */}
                            <p className="IDDocCamMeassage" style={{ color: this.state.txtColor }}>{this.state.message}</p>
                        </div>
                        {(this.state.isErrorStatus) && <div className="errorMessageView" style={{ bottom: window.innerHeight * 0.13 }}>
                            <div className="container" style = {{border:"1px solid #fff"}}>
                                <div className="errortitle">
                                    <img src={this.state.errorSRC} />
                                    <p>{t('errorMessageTitle')}</p>
                                </div>
                                <div className="errormessage">
                                    {(this.state.blurResult) && <p style={{ marginBottom: "3px" }}> {t('blurryErrorMes')} </p>}
                                    {(this.state.glareResult) && <p style={{ marginBottom: "3px" }}> {t('glareErrorMes')} </p>}
                                    {(!this.state.faceResult) && <p style={{ marginBottom: "3px" }}> {t('faceErrorMes')} </p>}
                                    {(this.state.isMrzDetected) && <p style={{ marginBottom: "3px" }}> {t('mrzErrorMes')} </p>}
                                </div>
                            </div>
                        </div>}
                        {(!this.state.previewImageStatuse) && <div className="IDCapture-Container" style={{ marginTop: window.innerHeight * 0.11,background:this.state.backgroundColor}}>
                            {(!this.state.isLoading) && <Button
                                label={t('idDocumentCamera.takePictureButton')}
                                onClick={this.onCapture}
                            />}
                            <p className="bottomTitle" style={{ color: this.state.txtColor }}>Powerd by BIOMIID RapidCheck</p>
                        </div>}
                        {(this.state.previewImageStatuse) && this.state.isMrzProcessing && <div className="ButtonPreview" style = {{background:this.state.backgroundColor}}>
                            {(!this.state.isErrorStatus) && <Button
                                label={t('idDocumentCamera.photoClearButton')}
                                onClick={() => {
                                    this.setState({ blurResult: false })
                                    this.setState({ glareResult: false })
                                    this.setState({ isMrzProcessing: false })
                                    this.setState({ isMrzLoading: false })
                                    let { IDTarget } = this.state
                                    if (IDTarget == "frontIDCard") {
                                        this.setState({ IDTarget: "backIDCard" })
                                        this.setState({ titleMessage: t('idDocumentCamera.idTitle') })
                                        this.setState({ idTitle: t('idDocumentCamera.backIDTitle') })
                                        this.setState({ message: t('idDocumentCamera.backIDMes') })
                                        this.setState({ previewImageStatuse: false })
                                        // window.FrontIDCardPath = this.state.IDDocImgURL
                                        window.FrontIDCardPath = this.state.croppedImageBase64
                                        // localStorage.setItem("FrontIDCardPath", this.state.IDDocImgURL)

                                    } else if (IDTarget == "passport") {
                                        if (window.surpportedDocType == "PA") {
                                            window.PassportPath = this.state.croppedImageBase64
                                            window.PassportCountry = window.countryName
                                            this.props.history.push('poadoc')
                                        } else {
                                            window.PassportPath = this.state.croppedImageBase64
                                            window.PassportCountry = window.countryName
                                            this.props.history.push('idmain')
                                        }
                                        // localStorage.setItem("PassportPath", this.state.IDDocImgURL)
                                        // localStorage.setItem("passportCountry",window.countryName)
                                    } else if (IDTarget == "frontResident") {
                                        this.setState({ IDTarget: "backResident" })
                                        this.setState({ titleMessage: t('idDocumentCamera.residentTitle') })
                                        this.setState({ idTitle: t('idDocumentCamera.backResidentTitle') })
                                        this.setState({ message: t('idDocumentCamera.backResidentMes') })
                                        this.setState({ previewImageStatuse: false })
                                        window.FrontResidentPath = this.state.croppedImageBase64
                                        // localStorage.setItem("FrontResidentPath", this.state.IDDocImgURL) 

                                    } else if (IDTarget == "backIDCard") {
                                        this.setState({ mrzDetectFlag: false })
                                        if (window.surpportedDocType == "PAID") {
                                            window.BackIDCardPath = this.state.croppedImageBase64
                                            window.IDCardCountry = window.countryName
                                            this.props.history.push('poadoc')
                                        } else {
                                            window.BackIDCardPath = this.state.croppedImageBase64
                                            window.IDCardCountry = window.countryName
                                            this.props.history.push('idmain')
                                        }

                                        // localStorage.setItem("BackIDCardPath", this.state.IDDocImgURL)
                                        // localStorage.setItem("idCardCountry",window.countryName)
                                    } else if (IDTarget == "backResident") {
                                        this.setState({ mrzDetectFlag: false })
                                        this.props.history.push('poadoc')
                                        window.BackResidentPath = this.state.croppedImageBase64
                                        window.ResidentCountry = window.countryName
                                        // localStorage.setItem("BackResidentPath", this.state.IDDocImgURL)
                                        // localStorage.setItem("residentCountry",window.countryName)
                                    }
                                }}
                            />}
                            <ReTakeButton
                                label={t('idDocumentCamera.reTakeButton')}
                                onClick={this.onReTake}
                            />
                            <p className="bottomTitle" style={{ color: this.state.txtColor }}>Powerd by BIOMIID RapidCheck</p>
                        </div>}
                    </div>
                    <Modal open={this.state.modalOpen} showCloseIcon={false} center>
                        <div className="modalView" style={{ height: window.innerHeight * 0.5 }}>
                            <div style={{ borderBottom: "solid 1px", borderColor: this.state.txtColor, width: "100%" }}>
                                <h2 style={{ paddingLeft: "30px", paddingRight: "30px", paddingTop: "10px", paddingBottom: "10px", color: "gray" }}>Leaving so soon?</h2>
                            </div>
                            <div>
                                <p style={{ color: this.state.txtColor, fontSize: "18px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px" }}>Are you sure you want to exit the identification process?</p>
                            </div>
                            <div style={{ position: "absolute", bottom: "15px", width: "100%", display: "flex", alignItems: "center", flexDirection: "column" }}>
                                <ExitButton
                                    label="EXIT"
                                    onClick={this.onEXit} />
                                <ContinueButton
                                    label="CONTIMUE"
                                    onClick={this.onCloseModal} />
                            </div>
                        </div>
                    </Modal>
                </div>

                <button onClick={this.onCapture}>take the capture</button>

            </div>
        )
    }
}
export default withTranslation(Result);