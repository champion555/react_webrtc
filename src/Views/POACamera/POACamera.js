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
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { decrypt, encrypt, generateKeyFromString } from 'dha-encryption';
import { v4 as uuidv4 } from 'uuid';
import { encryptRSA, decryptRSA, encryptionAES } from "../../Utils/crypto";
import ApiService from '../../Services/APIServices'
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
            warringSRC: warringURL,
            previewImageStatuse: false,
            POAMessage: null,
            isErrorStatus: false,
            blurResult: null,
            glareResult: null,
            backButtonSrc: BackURL,
            backgroundColor: "#7f00ff",
            titleColor: "white",
            previewBackColor: "white",
            pageTextColor: "gray",
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
            splitedBase64: null,
            isLoader: false,
            blurMesTitle: "",
            glareMesTitle: "",
            shadowMesTitle: "",
            reflectionMesTitle: "",
            imageQualityErrorMessage: ""
        }
    }
    componentDidMount = () => {
        this.setState({ backgroundColor: window.headerBackgroundColor })
        this.setState({ titleColor: window.headerTextColor })
        this.setState({ pageTextColor: window.pageTextColor })
        this.setState({ buttonBackgroundColor: window.buttonBackgroundColor })
        this.setState({ buttonTitleColor: window.buttonTextColor })

        console.log("poaIssueDate: ", window.poaIssueDate)
        console.log("poaDocType: ", window.poaDocType)
        console.log("poaLang: ", lan)
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
        var pieces = imageSrc.split(",");
        this.setState({ splitedBase64: pieces[1] })
        window.splitedBase64 = pieces[1]
        console.log(pieces[1])
        this.onPOACheck()
    }

    onPOACheck = () => {        
        this.setState({isLoader:true})
        // var aesKey = "dca672ae13434b79aa628095f2393387"
        var uuid = uuidv4()
        var uuidKey = generateKeyFromString(uuid)
        var hexstr = "";
        for (var i = 0; i < uuidKey.length; i++) {
            hexstr += uuidKey[i].toString(16);
        }
        var aesKey = hexstr.substring(0, 32)
        console.log("aesKey: ", aesKey)

        var publicKey = "-----BEGIN PUBLIC KEY-----\n" + window.rsaPublic_key + "\n-----END PUBLIC KEY-----"
        var encryptedAesKey = encryptRSA(aesKey, publicKey)
        console.log("encryptedAesKey: ", encryptedAesKey)

        var base64 = window.splitedBase64
        var aesEncryption = encryptionAES(base64, aesKey)
        console.log("aesEnctryption: ", aesEncryption)

        var url = process.env.REACT_APP_BASE_URL + "client/check/poaCheck"
        var data = {
            encryptedAESkey: encryptedAesKey,
            applicantId: window.applicantId,
            checkId: window.checkId,
            poa_docType: window.poaDocType,
            poa_language: lan,
            poa_issueDate: window.poaIssueDate,
            poa_image: aesEncryption,
            env: window.env
        }
        ApiService.uploadDoc('post', url, data, window.api_access_token, (res) => {
            try {
                var response = res.data
                console.log(response)
                var statusCode = response.statusCode
                console.log("statusCode:", statusCode)
                this.setState({isLoader:false})                
                if (statusCode === "200") {    
                    this.setState({ previewImageStatuse: true })                
                    this.setState({ POAMessage: t('poaDocumentCamera.previewMessage') })
                } else if(statusCode === "402") {
                    this.setState({ previewImageStatuse: true })
                    this.setState({ isErrorStatus: true })
                    var errorList = response.errorList
                    response.errorList.map((item, index) => {
                        console.log(item)
                        if (index == 0) {
                            switch (item) {
                                case "Glares":
                                    this.setState({ glareMesTitle: t("glareErrorMes") })
                                    break;
                                case "Blurries":
                                    this.setState({ blurMesTitle: t("blurryErrorMes") })
                                    break;
                                case "Shadows":
                                    this.setState({ shadowMesTitle: t("shadowErrorMes") })
                                    break;
                                case "Reflections":
                                    this.setState({ reflectionMesTitle: t("reflectionErrorMes") })
                                    break;
                            }
                        } else {
                            switch (item) {
                                case "Glares":
                                    this.setState({ glareMesTitle: ", " + t("glareErrorMes") })
                                    break;
                                case "Blurries":
                                    this.setState({ blurMesTitle: ", " + t("blurryErrorMes") })
                                    break;
                                case "Shadows":
                                    this.setState({ shadowMesTitle: ", " + t("shadowErrorMes") })
                                    break;
                                case "Reflections":
                                    this.setState({ reflectionMesTitle: ", " + t("reflectionErrorMes") })
                                    break;
                            }
                        }
                    })
                    this.setState({ imageQualityErrorMessage: t("imageQualityErrorMes") + this.state.glareMesTitle + this.state.blurMesTitle + this.state.shadowMesTitle + this.state.reflectionMesTitle })
                    console.log("errorMes: ",t("imageQualityErrorMes") + this.state.glareMesTitle + this.state.blurMesTitle + this.state.shadowMesTitle + this.state.reflectionMesTitle )
                }else if (statusCode === "401"){
                    alert(response.message)
                    this.setState({isLoader:false})
                }
            } catch (error) {
                alert("The server is not working, please try again.")
                this.setState({isLoader:false})
            }
        })
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
            console.log("croppedImageURL: ", croppedImageUrl)
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
                    <img id="poaimageID" src={this.state.croppedImageUrl} onLoad={() => this.onLoadedImage()} />
                    <canvas id="myCanvas" />
                </div>
                <div className="POACamera-Container">
                    <Camera
                        ref={this.webcamRef}
                        aspectRatio={this.state.cameraRatio}
                        facingMode={"environment"} />
                </div>
                {this.state.previewImageStatuse &&
                    <div className="POACropView">
                        <ReactCrop
                            src={this.state.capturedImageSrc}
                            crop={this.state.crop}
                            ruleOfThirds
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                        />
                    </div>
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
                                backgroundColor={this.state.buttonBackgroundColor}
                                buttonTextColor={this.state.buttonTitleColor}
                                label={t('poaDocumentCamera.takePictureButton')}
                                onClick={this.onCapture}
                            />
                        </div>}
                </div>
                {this.state.isLoader && <div className="POACam_loaderView" style={{ height: window.innerHeight }}>
                    <div className="loader" style={{ marginTop: window.innerHeight * 0.4 }}>
                        <Loader
                            type="Oval"
                            color={window.headerBackgroundColor}
                            height={80}
                            width={80}
                            visible={this.state.apiFlage}
                        />
                    </div>
                    <div style={{ width: "100%", justifyContent: "center", display: 'flex' }}>
                        <p className="POACAm_BottomTitle" style={{ color: this.state.pageTextColor }}>Powerd by BIOMIID</p>
                    </div>
                </div>}
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
                                <p style={{ color: this.state.pageTextColor }}>{this.state.POAMessage}</p>
                            </div>}
                            {(this.state.isErrorStatus) &&
                                <div className="POACamErrorMessageView" style={{ bottom: window.innerHeight * 0.3 }}>
                                    <div className="container" style={{ border: "1px solid #7f00ff" }}>
                                        <div className="errortitle">
                                            <img src={this.state.warringSRC} />
                                            <p style={{ color: this.state.pageTextColor }}>{t('errorMessageTitle')}</p>
                                        </div>
                                        <div className="errormessage">
                                            {(!this.state.blurResult) && <p style={{ marginBottom: "3px", color: this.state.pageTextColor }}> {this.state.imageQualityErrorMessage} </p>}
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
                                            backgroundColor={this.state.buttonBackgroundColor}
                                            buttonTextColor={this.state.buttonTitleColor}
                                            label={t('poaDocumentCamera.continueButton')}
                                            onClick={() => {
                                                window.POADocPath = this.state.ImageURL
                                                this.props.history.push('iddocresult')
                                            }}
                                        />
                                    </div>}
                                </div>}
                            {/* <div style={{ width: "100%", justifyContent: "center", display: 'flex' }}>
                                <p className="POACAm_BottomTitle" style={{ color: "#fff" }}>Powerd by BIOMIID</p>
                            </div> */}
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
                                    backgroundColor={this.state.buttonBackgroundColor}
                                    buttonTextColor={this.state.buttonTitleColor}
                                    label="NO"
                                    onClick={this.onCloseModal} />
                            </div>
                            <div style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px" }}>
                                <ContinueButton
                                    backgroundColor={this.state.buttonBackgroundColor}
                                    buttonTextColor={this.state.buttonTitleColor}
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