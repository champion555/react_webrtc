import React, { Component, createRef } from 'react';
import { Camera } from "react-camera-pro";
import Button from "../../Components/POAButton/POAButton"
import errorURL from "../../assets/ic_error.png"
import warringURL from "../../assets/ic_warring.png"
import BackURL from "../../assets/ic_cancel_white.png"
import ReTakeButton from "../../Components/volietBorderButton/volietBorderButton"
import ExitButton from '../../Components/button/button'
import ContinueButton from "../../Components/POAButton/POAButton"
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { check_blur, check_blur_base64, check_glare_base64, check_face_base64, check_glare, check_face } from 'image-analitic-lib'
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'
import './POACamera.css'
import header from '../../Components/header/header';
let lan = localStorage.getItem('language');
setDefaultLanguage(lan)


class POACamera extends Component {
    constructor(props) {
        super(props);
        this.webcamRef = React.createRef();
        this.state = {
            cameraRatio: null,
            capturedImageSrc: null,
            errorSRC: errorURL,
            warringSRC:warringURL,
            previewImageStatuse: false,
            POAMessage: null,
            isErrorStatus: false,
            blurResult: null,
            glareResult: null,
            backButtonSrc: BackURL,
            backgroundColor: "#7f00ff",
            titleColor: "white",
            previewBackColor: "white",
            previewImgHeight: null,
            previewButtonHeight: null,
            croppedImageUrl: null,
            croppedImageBase64: null,
            crop: {
                unit: '%',
                x: 0,
                y: 7,
                width: 100,
                height: 81,
                aspect: 16 / 9
            },
        }
    }
    componentDidMount = () => {
        const ratio = window.innerWidth / window.innerHeight
        this.setState({ cameraRatio: ratio })
        this.onSetMessage()
        if (window.innerHeight > 600) {
            this.setState({ previewImgHeight: window.innerHeight * 0.73 })
            this.setState({ previewButtonHeight: window.innerHeight * 0.2 })
        } else {
            this.setState({ previewImgHeight: window.innerHeight * 0.68 })
            this.setState({ previewButtonHeight: window.innerHeight * 0.25 })
        }
    }
    onSetMessage = () => {
        this.setState({ POAMessage: t('poaDocumentCamera.message') })
    }
    onCapture = () => {
        const imageSrc = this.webcamRef.current.takePhoto()
        this.setState({ capturedImageSrc: imageSrc })
        console.log(imageSrc)
        this.setState({ previewImageStatuse: true })
        this.setState({ POAMessage: t('poaDocumentCamera.previewMessage') })
    }
    onReTake = () => {
        this.setState({ previewImageStatuse: false })
        this.setState({ isErrorStatus: false })
        this.setState({ POAMessage: t('poaDocumentCamera.message') })
    }
    onLoadedImage() {
        var canvas = document.createElement("canvas");
        canvas.width = document.getElementById("poaimageID").width;
        canvas.height = document.getElementById("poaimageID").height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(document.getElementById("poaimageID"), 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        this.setState({ croppedImageBase64: dataURL });
        var b = check_blur('poaimageID');
        var g = check_glare('poaimageID')
        var f = check_face('poaimageID')
        this.setState({ blurResult: b.b })
        this.setState({ glareResult: g })
        if (b.b == true || g == true) {
            this.setState({ isErrorStatus: true })
            console.log("ddddlajldjl")
        }
        console.log(b)
        console.log(g)
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
            <div>
                <div style={{ position: "absolute", zIndex: "-10", top: "0px" }}>
                    <img id="poaimageID" src={this.state.croppedImageUrl} onLoad={() => this.onLoadedImage()}/>
                    <canvas id="myCanvas" />
                </div>
                <div className="POACamera-Container">
                    <Camera
                        ref={this.webcamRef}
                        aspectRatio={this.state.cameraRatio}
                        facingMode={"environment"} />
                </div>

                {this.state.previewImageStatuse &&
                    <div className = "POACropView">
                        <ReactCrop
                            src={this.state.capturedImageSrc}
                            crop={this.state.crop}
                            ruleOfThirds
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                        />
                    </div>
                    // <div className="POAPreviewImage-container" style={{ height: window.innerHeight }}>
                    //     <img style={{ width: "100%", height: window.innerHeight }} id="poaimageID" src={this.state.capturedImageSrc} onLoad={() => this.onLoadedImage()} />
                    // </div>
                }
                <div className="POAMain-container" style={{ height: window.innerHeight }}>
                    <div className="LivenessTopBar" style={{ height: window.innerHeight * 0.07, background: this.state.backgroundColor }}>
                        <img src={this.state.backButtonSrc} onClick={this.onOpenModal} className="photoLivenessbtnBack" />
                        <p className="liveness_txtTitle" style={{ color: this.state.titleColor }}>{t('poaDocumentCamera.title')}</p>
                        <div style={{ width: '10px' }}></div>
                    </div>
                    {(!this.state.previewImageStatus) &&
                        <div className="POATakeButtonView" style={{ display: "flex", justifyContent: "center", paddingLeft: "15px", paddingRight: "15px" }}>
                            <Button
                                label={t('poaDocumentCamera.takePictureButton')}
                                onClick={this.onCapture}
                            />
                        </div>}
                </div>
                {this.state.previewImageStatuse &&
                    <div className="POACam_PreviewView" style={{ height: window.innerHeight }}>
                        <div className="LivenessTopBar" style={{ height: window.innerHeight * 0.07, background: this.state.backgroundColor }}>
                            <img src={this.state.backButtonSrc} onClick={this.onOpenModal} className="photoLivenessbtnBack" />
                            <p className="liveness_txtTitle" style={{ color: this.state.titleColor }}>{t('poaDocumentCamera.title')}</p>
                            <div style={{ width: '10px' }}></div>
                        </div>
                        <div style={{ width: "100%", height: this.state.previewImgHeight, background: this.state.previewBackColor }}>
                            <div style={{ justifyContent: "center", display: "flex", paddingTop: "10px" }}>
                                <img className="POAPreviewImg" style={{ height: this.state.previewImgHeight - 10 }} id="poaimageID" src={this.state.croppedImageBase64} />
                            </div>
                        </div>
                        <div className="container" style={{ height: this.state.previewButtonHeight, background: this.state.previewBackColor }}>
                            {(!this.state.isErrorStatus) && <div className="POAMessageView">
                                <img src={this.state.warringSRC} className="errorIcon" />
                                <p style = {{color:"gray"}}>{this.state.POAMessage}</p>
                            </div>}
                            {(this.state.isErrorStatus) &&
                                <div className="POACamErrorMessageView" style={{ bottom: window.innerHeight * 0.3 }}>
                                    <div className="container" style={{ border: "1px solid #7f00ff" }}>
                                        <div className="errortitle">
                                            <img src={this.state.warringSRC} />
                                            <p style = {{color:"gray"}}>{t('errorMessageTitle')}</p>
                                        </div>
                                        <div className="errormessage">
                                            {(!this.state.blurResult) && <p style={{ marginBottom: "3px",color:"gray" }}> {t('blurryErrorMes')} </p>}
                                            {(!this.state.glareResult) && <p style={{ marginBottom: "3px",color:"gray" }}> {t('glareErrorMes')} </p>}
                                        </div>
                                    </div>
                                </div>}
                            {(this.state.previewImageStatuse) &&
                                <div className="POAPreviewButtonView">
                                    <div style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px" }}>
                                        <ReTakeButton
                                            label={t('poaDocumentCamera.retakeButton')}
                                            onClick={this.onReTake}
                                        />
                                    </div>
                                    {(!this.state.isErrorStatus) && <div style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px" }}>
                                        <Button
                                            label={t('poaDocumentCamera.continueButton')}
                                            onClick={() => {
                                                window.POADocPath = this.state.ImageURL
                                                this.props.history.push('iddocresult')
                                            }}
                                        />
                                    </div>}
                                </div>}
                            <div style={{ width: "100%", justifyContent: "center", display: 'flex' }}>
                                <p className="POACAm_BottomTitle" style={{ color: "#fff" }}>Powerd by BIOMIID</p>
                            </div>

                        </div>
                    </div>}
                <Modal open={this.state.modalOpen} showCloseIcon={false} center>
                    <div className="modalView" style={{ height: window.innerHeight * 0.3 }}>
                        <div>
                            <p style={{ color: this.state.txtColor, fontSize: "18px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px" }}>Are you sure you want to exit the identification process?</p>
                        </div>
                        <div style={{ position: "absolute", bottom: "15px", width: "100%", display: "flex", alignItems: "center", flexDirection: "row" }}>

                            <div style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px" }}>
                                <ContinueButton
                                    label="NO"
                                    onClick={this.onCloseModal} />
                            </div>
                            <div style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px" }}>
                                <ContinueButton
                                    label="YES"
                                    onClick={this.onEXit} />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default withTranslation(POACamera);