import React, { Component } from 'react';
import { withRouter } from "react-router";
import captureImg from "../../assets/camera_take.png"
import UndetectImgURL from "../../assets/ic_undetected4.png"
import DetectImgURL from "../../assets/ic_detected4.png"
import BackURL from "../../assets/ic_cancel_white.png"
import Button from "../../Components/POAButton/POAButton"
import WarringImgURL from "../../assets/ic_error.png"
import ExitButton from '../../Components/button/button'
import ContinueButton from "../../Components/POAButton/POAButton"
import 'react-responsive-modal/styles.css';
import ReactCrop from "react-image-crop";
import { Modal } from 'react-responsive-modal';
import LogoURL from "../../assets/ic_logo1.png";
import { PhotoUpload } from '../../lib/AppUtils';
import Loader from 'react-loader-spinner';
import { decrypt, encrypt, generateKeyFromString } from 'dha-encryption';
import { Encrypt } from "rsa-encrypt-long";
import Crypt from "hybrid-crypto-js";
import JSEncrypt from "jsencrypt";
import CryptoJS from 'crypto-js';
import aes from 'js-crypto-aes';
import { stringify, v4 as uuidv4 } from 'uuid';
import { encryptRSA, decryptRSA, encryptionAES,aes_encryption } from "../../Utils/crypto";
import ClientJS from "clientjs"
import forge from "node-forge";
import { privateKey, publicKey } from '../../Utils/key';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './PhotoLiveness.css';
import Webcam from "react-webcam";
import ApiService from '../../Services/APIServices'
import { within } from '@testing-library/react';
import Base64Downloader from 'react-base64-downloader';
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation } from 'react-multi-lang'

let lan = localStorage.getItem('language');
setDefaultLanguage(lan)

class PhotoLiveness extends Component {
    constructor(props) {
        super(props);
        this.state = {
            frameHeight: window.innerHeight,
            captureImgSrc: captureImg,
            ImageURL: null,
            ImgSrc: DetectImgURL,
            apiFlage: false,
            backButtonSrc: BackURL,
            warringSrc: WarringImgURL,
            screenshot: null,
            titleColor: "white",
            backgroundColor: "#525151",
            whiteColor: "#fff",
            modalOpen: false,
            alertOpen: false,
            crop: null,
            croppedImageUrl: null,
            splitedBase64: null,
            alertMessage: ""
        };
    }
    componentDidMount = () => {        
        if (window.innerHeight > 600) {
            this.setState({
                crop: {
                    unit: '%',
                    x: 15,
                    y: 5,
                    width: 70,
                    height: 83,
                    aspect: 16 / 9
                }
            })
        } else {
            this.setState({
                crop: {
                    unit: '%',
                    x: 15,
                    y: 5,
                    width: 70,
                    height: 68,
                    aspect: 16 / 9
                }
            })
        }

    }
    onCapture = () => {
        const imageSrc = this.webcam.getScreenshot();
        this.setState({ screenshot: imageSrc })
        window.livenessImage = imageSrc
        var pieces = imageSrc.split(",");
        this.setState({ splitedBase64: pieces[1] })
        this.onGetAuthentication()
    };

    onGetAuthentication = () => {
        this.setState({ apiFlage: true })
        var url = process.env.REACT_APP_BASE_URL + "client/authentificate"
        var data = {
            api_key: window.api_key,
            secret_key: window.secret_key,
            env: window.env
        }
        ApiService.apiCall('post', url, data, (res) => {
            try {
                console.log(res.data)
                var response = res.data
                var status = response.status
                if (status === "SUCCESS") {
                    var api_access_token = response.api_access_token
                    window.api_access_token = api_access_token
                    console.log(api_access_token)
                    this.onUploadLivenessPhoto()
                } else {
                    this.setState({ alertMessage: response.message })
                    this.setState({ alertOpen: true })
                }
            } catch (error) {
                console.log("error:", error)
                this.setState({ alertMessage: "The server is not working, please try again" })
                this.setState({ alertOpen: true })
            }
        })
    }
    onUploadLivenessPhoto = () => {
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
        var base64 = this.state.splitedBase64
        var aesEncryption = aes_encryption(base64, aesKey)
        console.log("aesEnctryption: ", aesEncryption)

        var url = process.env.REACT_APP_BASE_URL + "faceliveness"
        var data = {
            encryptedAESkey: encryptedAesKey,
            live_image_file_web: aesEncryption,
            applicantId: window.applicantId,
            checkId: window.checkId,
            imageType: "image/jpeg",
            env: window.env
        }
        ApiService.uploadDoc('post', url, data, window.api_access_token, (res) => {
            try {
                console.log(res.data)
                var response = res.data;
                // alert(JSON.stringify(response))
                // this.props.history.push('documentcountry')
                // alert("LivenessScore:" + response.score)
                if (response.result === "LIVENESS") {
                    this.onUploadDeviceFeatures()
                } else if (response.result === "SPOOF") {
                    this.setState({ apiFlage: false })
                    window.livenessResult = response.result
                    this.setState({ ImgSrc: UndetectImgURL })
                    this.props.history.push('livenessresult')
                } else {
                    this.setState({ apiFlage: false })
                    window.livenessResult = response.result
                    this.setState({ ImgSrc: UndetectImgURL })
                    this.props.history.push('livenessresult')
                }
            } catch (error) {
                this.setState({ alertMessage: "The server is not working, please try again" })
                this.setState({ alertOpen: true })
                this.setState({ apiFlage: false })
                this.setState({ ImgSrc: UndetectImgURL })
            }
        })
    }
    onUploadDeviceFeatures = () => {
        var windowClient = new window.ClientJS();
        var canvasPrint = windowClient.getCanvasPrint()
        var customeFingerPrint = windowClient.getCustomFingerprint(canvasPrint);
        console.log("customeFingerPrint: ", customeFingerPrint)
        var userAgent = windowClient.getUserAgent();
        console.log("userAgent: ", userAgent)
        var browser = windowClient.getBrowser();
        console.log("browser: ", browser)
        var browserMajorVersion = windowClient.getBrowserMajorVersion()
        console.log("browserMajorVersion: ", browserMajorVersion)
        var engine = windowClient.getEngine()
        console.log("engine: ", engine)
        var engineVersion = windowClient.getEngineVersion()
        console.log("engineVersion: ", engineVersion)
        var osName = windowClient.getOS()
        console.log("osName: ", osName)
        var osVersion = windowClient.getOSVersion()
        console.log("osVersion: ", osVersion)
        var deviceType = windowClient.getDeviceType()
        console.log("deviceType: ", deviceType)
        var screenPrint = windowClient.getScreenPrint()
        console.log("screenPrint: ", screenPrint)
        var colorDepth = windowClient.getColorDepth()
        console.log("colorDepth: ", colorDepth)
        var currentResolution = windowClient.getCurrentResolution()
        console.log("currentResolution: ", currentResolution)
        var availableResolution = windowClient.getAvailableResolution()
        console.log("availableResolution: ", availableResolution)
        var localStorage = windowClient.isLocalStorage()
        console.log("localStorage: ", localStorage)
        var sessionStorage = windowClient.isSessionStorage();
        console.log("sessionStorage: ", sessionStorage)
        var timezone = windowClient.getTimeZone()
        console.log("timezone: ", timezone)
        var language = windowClient.getLanguage()
        console.log("language: ", language)
        var systemLanguage = windowClient.getSystemLanguage()
        console.log("systemLanguage: ", systemLanguage)

        var canvas = document.getElementById('canvas');
        var gl = canvas.getContext('webgl');
        var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        var webGLVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        console.log("webGLVendor:  ", webGLVendor);
        var webGLRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        console.log("webGLRenderer: ", webGLRenderer);
        var platform = navigator.platform
        console.log("platform: ", platform)
        var data = {
            fingerPrint: customeFingerPrint,
            userAgent: userAgent,
            browser: browser,
            browserMajorVersion: browserMajorVersion,
            engine: engine,
            engineVersion: engineVersion,
            osName: osName,
            osVersion: osVersion,
            deviceType: deviceType,
            screenPrint: screenPrint,
            colorDepth: colorDepth,
            currentResolution: currentResolution,
            availableResolution: availableResolution,
            localStorage: localStorage,
            sessionStorage: sessionStorage,
            timezone: timezone,
            language: language,
            systemLanguage: systemLanguage,
            canvasPrint: canvasPrint,
            webGLVendor: webGLVendor,
            webGLRenderer: webGLRenderer,
            platform: platform
        }
        console.log(JSON.stringify(data))
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
        var base64 = JSON.stringify(data)
        var aesEncryption = aes_encryption(base64, aesKey)
        console.log("aesEnctryption: ", aesEncryption)
        var url = process.env.REACT_APP_BASE_URL + "client/collectDeviceFeatures"
        var data = {
            checkId: window.checkId,
            applicantId: window.applicantId,
            env: window.env,
            activityName: "activity_2",
            isBot: window.isBot,
            isIncognitoMode: false,
            deviceType: "BROWSER",
            browserComponents: aesEncryption,
            encryptedAESKey: encryptedAesKey
        }
        ApiService.uploadDoc('post', url, data, window.api_access_token, (res) => {
            try {
                console.log(res.data)
                this.setState({ apiFlage: false })
                var response = res.data;
                this.props.history.push('documentcountry')
            } catch (error) {
                this.setState({ apiFlage: false })
                this.setState({ alertMessage: "The server is not working, please try again" })
                this.setState({ alertOpen: true })
            }
        })
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
            window.photoLivenessSrc = croppedImageUrl
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
    onCloseAlert = () => {
        this.setState({ alertOpen: false })
    }

    render() {
        const { t } = this.props
        const videoConstraints = {
            facingMode: "user"
        };
        return (
            <div>
                <canvas id="canvas" />
                <div className="LivenessCamera-Container">
                    <Webcam
                        audio={false}
                        mirrored={true}
                        ref={this.setRef}
                        screenshotFormat="image/jpeg"
                        imageSmoothing={true}
                        width={"100%"}
                        screenshotQuality={1.0}
                        videoConstraints={videoConstraints}
                        forceScreenshotSourceSize="flase"
                    />
                </div>
                <div style={{ width: "100%", position: "absolute", zIndex: "-5", marginTop: "10px" }}>
                    <ReactCrop
                        src={this.state.screenshot}
                        crop={this.state.crop}
                        ruleOfThirds
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onCropComplete}
                        onChange={this.onCropChange}
                    />
                </div>
                <div style={{ position: "absolute", zIndex: "10", width: "100%", height: window.innerHeight }}>
                    <div className="LivenessTopBar" style={{ height: window.innerHeight * 0.07, background: this.state.backgroundColor }}>
                        <img src={this.state.backButtonSrc} onClick={this.onOpenModal} className="photoLivenessbtnBack" />
                        <p className="liveness_txtTitle" style={{ color: this.state.whiteColor }}>{t('PhotoLivness.title')}</p>
                        <div style={{ width: '10px' }}></div>
                    </div>
                    <div style={{ width: "100%", height: window.innerHeight * 0.031, background: this.state.backgroundColor }} />
                    <div style={{ width: "100%", height: window.innerHeight * 0.6, backgroundImage: `url(${this.state.ImgSrc})`, backgroundSize: "100% 100%" }}></div>
                    <div className="liveness-captureButton" style={{ height: window.innerHeight * 0.3, background: this.state.backgroundColor }}>
                        <div style={{ width: "100%", display: "flex", flexDirection: "row", position: "absolute", top: "5px", paddingLeft: "15px", paddingRight: "15px", alignItems: "center" }}>
                            <img src={this.state.warringSrc} style={{ width: "20px", height: "20px" }} />
                            <p style={{ fontSize: "16px", color: this.state.titleColor, paddingLeft: "10px" }}>{t('PhotoLivness.message')}</p>
                        </div>

                        <div style={{ position: "absolute", bottom: "35px", width: '100%', display: "flex", justifyContent: "center", paddingRight: "15px", paddingLeft: "15px" }}>
                            <Button
                                backgroundColor={window.buttonBackgroundColor}
                                buttonTextColor={window.buttonTextColor}
                                label={t('PhotoLivness.takeCaptureButton')}
                                onClick={() => this.onCapture()}
                            />
                        </div>
                        <p style={{ color: this.state.titleColor, fontStyle: 'italic', position: "absolute", bottom: "5px" }}>Powerd by BIOMIID</p>
                    </div>

                </div>

                {(this.state.apiFlage) && <div style={{ width: "100%", height: window.innerHeight, zIndex: 20, background: "#fff", position: "absolute", textAlign: "center", justifyContent: "center", display: "flex" }}>
                    <p style={{ color: "#383838", fontStyle: 'italic', position: "absolute", bottom: "15px" }}>Powerd by BIOMIID</p>
                </div>}
                <div className="loadingView" style={{ bottom: window.innerHeight * 0.5 }}>
                    <Loader
                        type="Oval"
                        color={window.buttonBackgroundColor}
                        height={80}
                        width={80}
                        visible={this.state.apiFlage}
                    />
                </div>
                <Modal open={this.state.modalOpen} showCloseIcon={false} center>
                    <div className="modalView" style={{ height: window.innerHeight * 0.3 }}>
                        <div>
                            <p style={{ color: this.state.txtColor, fontSize: "18px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px" }}>Are you sure you want to exit the identification process?</p>
                        </div>
                        <div style={{ position: "absolute", bottom: "15px", width: "100%", display: "flex", alignItems: "center", flexDirection: "row" }}>

                            <div style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px" }}>
                                <ContinueButton
                                    backgroundColor={window.buttonBackgroundColor}
                                    buttonTextColor={window.buttonTextColor}
                                    label="NO"
                                    onClick={this.onCloseModal} />
                            </div>
                            <div style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px" }}>
                                <ContinueButton
                                    backgroundColor={window.buttonBackgroundColor}
                                    buttonTextColor={window.buttonTextColor}
                                    label="YES"
                                    onClick={this.onEXit} />
                            </div>
                        </div>
                    </div>
                </Modal>

                <Modal open={this.state.alertOpen} showCloseIcon={false} center>
                    <div className="alertView" style={{ height: window.innerHeight * 0.2 }}>
                        <p>{this.state.alertMessage}</p>
                        <div className="alert_button" onClick={this.onCloseAlert}> OK </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withTranslation(PhotoLiveness);
