import React, { Component, createRef } from 'react';
import Header from '../../Components/whiteHeader/whiteHeader'
import { withRouter } from "react-router";
import backURL from "../../assets/ic_cancel_white.png"
import grayBackURL from "../../assets/ic_cancel.png"
import captureURL from "../../assets/camera_take.png"
import errorURL from "../../assets/ic_error.png"
import warringURL from "../../assets/ic_warring.png"
import idcardURL from "../../assets/ic_idcardframe1.png"
import successURL from "../../assets/ic_result_success.png"
import failedURL from "../../assets/ic_failed.png"
import Button from "../../Components/POAButton/POAButton"
import CaptureButton from "../../Components/button/button"
import frontCardHelpURL from "../../assets/ic_frontCardHelp.png"
import backCardHelpURL from "../../assets/ic_backCardHelp.png"
import passportHelpURL from "../../assets/ic_passportHelp.png"
import ExitButton from '../../Components/button/button'
import ContinueButton from "../../Components/POAButton/POAButton"
import ReTakeButton from "../../Components/volietBorderButton/volietBorderButton"
import { Camera } from "react-camera-pro";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { VaildIDDocumentCheck } from '../../lib/AppUtils';
import Loader from 'react-loader-spinner'
import Base64Downloader from 'react-base64-downloader';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import ClientJS from "clientjs"
import { v4 as uuidv4 } from 'uuid';
import { encryptRSA, decryptRSA, encryptionAES,aes_encryption } from "../../Utils/crypto";
import { decrypt, encrypt, generateKeyFromString } from 'dha-encryption';
import ApiService from '../../Services/APIServices'
import './IDDocCamera.css'
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'
import { buildQueries } from '@testing-library/react';
let lan = localStorage.getItem('language');
setDefaultLanguage(lan)

var openWindow;
var imageQualityErrorMessage;

class IDDocCmamera extends Component {
    constructor(props) {
        super(props);
        this.webcamRef = React.createRef();
        this.state = {
            backButtonSRC: backURL,
            captureButtonSRC: captureURL,
            errorSRC: errorURL,
            warringSRC: warringURL,
            idCardSRC: idcardURL,
            previewBackSrc: grayBackURL,
            IDTarget: "",
            message: "",
            titleMessage: "",
            idTitle: "",
            previewImageStatuse: false,
            isErrorStatus: false,
            screenshot: null,
            isCamSize: null,
            txtColor: "white",
            backgroundColor: "#525151",
            modalOpen: false,
            crop: {
                unit: '%',
                x: 0,
                y: 7,
                width: 100,
                height: 44,
                aspect: 16 / 9
            },
            croppedImageUrl: null,
            croppedImageBase64: null,
            cameraRatio: null,
            surpportedDocType: null,
            previewBackColor: "white",
            headerColor: "#7f00ff",
            headerTitlecolor: "white",
            imgQualityErrorMes: false,
            faceErrorMes: false,
            mrzErrorMes: false,
            inputImgErrorMes: false,
            isMrzProcessing: false,
            isMrzLoading: false,
            mrzDetectFlag: false,
            Mode: null,
            blurMesTitle: "",
            glareMesTitle: "",
            shadowMesTitle: "",
            reflectionMesTitle: "",
            imageQualityErrorMessage: "",
            idDocumentType: "",
            isDeviceComponent: false,
            helpImgSrc: passportHelpURL,
            isHelp: true,
            markSrc: successURL,
            resultColor: "red",
            helpHeaderTitle: "",
            helpTitle: "",
            alertMessage: "",
            alertOpen: false,
            bottomMargin:"50px",
            imageHeight:window.innerHeight*0.4
        }
    }
    componentDidMount = () => {
        console.log("process.env.BASE_CORE_URL: ", process.env.REACT_APP_BASE_CORE_URL)
        console.log("process.env.BASE_CORE_URL: ", process.env.REACT_APP_BASE_URL)
        console.log("countryCode: ", window.countryCode)
        this.setState({ headerColor: window.headerBackgroundColor })
        this.setState({ headerTitleColor: window.headerTextColor })
        const ratio = window.innerWidth / window.innerHeight
        console.log("width", window.innerWidth)
        console.log("height", window.innerHeight)
        this.setState({ cameraRatio: ratio })
        console.log(window.countryName)
        console.log(window.IDType)
        console.log(window.cameraMode)
        this.onSetMessage()
        if (window.innerHeight > 600) {
            this.setState({bottomMargin:"50px"})
            this.setState({imageHeight:window.innerHeight*0.4})

        } else {
            this.setState({bottomMargin:"25px"})
            this.setState({imageHeight:window.innerHeight*0.3})
        }
    }
    onSetMessage = () => {
        this.setState({ Mode: "FRONT" })
        if (window.IDType == "idcard" || window.IDType === "oldidcard") {
            this.setState({ helpImgSrc: frontCardHelpURL })
            this.setState({ helpHeaderTitle: t('idDocHelp.frontIDtHeaderTitle') })
            this.setState({ helpTitle: t('idDocHelp.frontIDTitle') })
            this.setState({ idDocumentType: "NATIONAL_ID_CARD" })
            this.setState({ surpportedDocType: "ID" })
            if (window.IDType === "idcard") {
                this.setState({ IDTarget: "frontIDCard" })
            } else {
                this.setState({ IDTarget: "oldFrontIDCard" })
            }
            this.setState({ message: t('idDocumentCamera.frontIDMes') })
            this.setState({ titleMessage: t('idDocumentCamera.idTitle') })
            this.setState({ idTitle: t('idDocumentCamera.frontIDTitle') })
        } else if (window.IDType == "passport") {
            this.setState({ helpImgSrc: passportHelpURL })
            this.setState({ helpHeaderTitle: t('idDocHelp.passportHeaderTitle') })
            this.setState({ helpTitle: t('idDocHelp.passportTitle') })
            this.setState({ idDocumentType: "PASSPORT" })
            this.setState({ surpportedDocType: "PA" })
            this.setState({ IDTarget: "passport" })
            this.setState({ idTitle: t('idDocumentCamera.passportTitle') })
            this.setState({ message: t('idDocumentCamera.passportMes') })
            this.setState({ titleMessage: t('idDocumentCamera.passportTitle') })
        } else if (window.IDType == "resident" || window.IDType === "oldresident") {
            this.setState({ helpImgSrc: frontCardHelpURL })
            this.setState({ helpHeaderTitle: t('idDocHelp.frontIDtHeaderTitle') })
            this.setState({ helpTitle: t('idDocHelp.frontIDTitle') })
            this.setState({ idDocumentType: "RESIDENCE_PERMIT" })
            this.setState({ surpportedDocType: "RE" })
            if (window.IDType === "resident") {
                this.setState({ IDTarget: "frontResident" })
            } else {
                this.setState({ IDTarget: "oldFrontResident" })
            }
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
        this.setState({ isDeviceComponent: false })
        this.setState({ titleMessage: t('idDocumentCamera.previewTitle') })
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
        var pieces = dataURL.split(",");
        this.onCheckIDDocument(pieces[1])
    }
    onCheckIDDocument = (croppedBase64) => {
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

        var base64 = croppedBase64
        var aesEncryption = aes_encryption(base64, aesKey)
        console.log("aesEnctryption: ", aesEncryption)

        console.log("inputData", this.state.Mode, window.countryCode, window.applicantId, window.checkId, window.env)

        var url = process.env.REACT_APP_BASE_CORE_URL + "mrz_idcheck"
        var data = {
            encryptedAESkey: encryptedAesKey,
            image_file: aesEncryption,
            mode: this.state.Mode,
            countryCode: window.countryCode,
            docType: this.state.surpportedDocType,
            documentType: this.state.idDocumentType,
            applicantId: window.applicantId,
            checkId: window.checkId,
            env: window.env
        }
        // alert(
        //     "mode:  " + this.state.Mode + "\n" +
        //     "countryCode:  " + window.countryCode + "\n" +
        //     "docType:  " + this.state.surpportedDocType + "\n" +
        //     "documentType:  " + this.state.idDocumentType + "\n" +
        //     "applicantId:  " + window.applicantId + "\n" +
        //     "checkId: " + window.checkId + "\n" +
        //     "env:" + window.env
        // )
        ApiService.uploadDoc('post', url, data, window.api_access_token, (res) => {
            try {
                this.setState({ message: t('idDocumentCamera.previewMes') })
                this.setState({ isMrzLoading: false })
                this.setState({ isMrzProcessing: true })
                var response = res.data;
                // alert(JSON.stringify(response))
                console.log("response:", response)
                console.log("statusCode:", response.statusCode)
                if (response.statusCode === "402") {
                    this.setState({ isErrorStatus: true })
                    this.setState({ markSrc: failedURL })
                    this.setState({ resultColor: "red" })
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
                    console.log(this.state.glareMesTitle + this.state.blurMesTitle + this.state.shadowMesTitle + this.state.reflectionMesTitle)
                    this.setState({ imageQualityErrorMessage: t("imageQualityErrorMes") + this.state.glareMesTitle + this.state.blurMesTitle + this.state.shadowMesTitle + this.state.reflectionMesTitle })
                    this.setState({ imgQualityErrorMes: true })

                } else if (response.statusCode === "401") {
                    this.setState({ alertMessage: response.message })
                    this.setState({ alertOpen: true })
                    this.setState({ isMrzLoading: false })
                    this.onReTake()
                } else {
                    let { IDTarget } = this.state
                    switch (IDTarget) {
                        case "frontIDCard":
                            if (response.statusCode === "405") {
                                this.setState({ isErrorStatus: true })
                                this.setState({ faceErrorMes: true })
                                this.setState({ markSrc: failedURL })
                                this.setState({ resultColor: "red" })
                            } else {
                                this.setState({ isErrorStatus: false })
                                this.setState({ markSrc: successURL })
                                this.setState({ resultColor: "#00ff18" })
                            }
                            break;
                        case "passport":
                            if (response.statusCode === "405") {
                                this.setState({ isErrorStatus: true })
                                this.setState({ faceErrorMes: true })
                                this.setState({ markSrc: failedURL })
                                this.setState({ resultColor: "red" })
                            } else {
                                if (response.statusCode === "200" && response.isValid) {
                                    this.setState({ isErrorStatus: false })
                                    this.setState({ markSrc: successURL })
                                    this.setState({ resultColor: "#00ff18" })
                                } else if (response.statusCode === "400") {
                                    this.setState({ isErrorStatus: true })
                                    this.setState({ mrzErrorMes: true })
                                    this.setState({ markSrc: failedURL })
                                    this.setState({ resultColor: "red" })
                                } else {
                                    this.setState({ isErrorStatus: true })
                                    this.setState({ inputImgErrorMes: true })
                                    this.setState({ markSrc: failedURL })
                                    this.setState({ resultColor: "red" })
                                }
                            }
                            break;
                        case "frontResident":
                            if (response.statusCode === "405") {
                                this.setState({ isErrorStatus: true })
                                this.setState({ faceErrorMes: true })
                                this.setState({ markSrc: failedURL })
                                this.setState({ resultColor: "red" })
                            } else {
                                this.setState({ isErrorStatus: false })
                                this.setState({ markSrc: successURL })
                                this.setState({ resultColor: "#00ff18" })
                            }
                            break;
                        case "backIDCard":
                            if (response.statusCode === "200" && response.isValid) {
                                this.setState({ isErrorStatus: false })
                                this.setState({ markSrc: successURL })
                                this.setState({ resultColor: "#00ff18" })
                            } else {
                                this.setState({ isErrorStatus: true })
                                if (response.statusCode === "400") {
                                    this.setState({ mrzErrorMes: true })
                                    this.setState({ markSrc: failedURL })
                                    this.setState({ resultColor: "red" })
                                } else if (response.statusCode === "403" || response.statusCode === "406") {
                                    this.setState({ inputImgErrorMes: true })
                                    this.setState({ markSrc: failedURL })
                                    this.setState({ resultColor: "red" })
                                } else {
                                    this.setState({ isErrorStatus: false })
                                    this.setState({ markSrc: successURL })
                                    this.setState({ resultColor: "#00ff18" })
                                }
                            }
                            break;
                        case "backResident":
                            if (response.statusCode === "200" && response.isValid) {
                                this.setState({ isErrorStatus: false })
                                this.setState({ markSrc: successURL })
                                this.setState({ resultColor: "#00ff18" })
                            } else {
                                this.setState({ isErrorStatus: true })
                                if (response.statusCode === "400") {
                                    this.setState({ mrzErrorMes: true })
                                    this.setState({ markSrc: failedURL })
                                    this.setState({ resultColor: "red" })
                                } else if (response.statusCode === "403" || response.statusCode === "406") {
                                    this.setState({ inputImgErrorMes: true })
                                    this.setState({ markSrc: failedURL })
                                    this.setState({ resultColor: "red" })
                                } else {
                                    this.setState({ isErrorStatus: false })
                                    this.setState({ markSrc: successURL })
                                    this.setState({ resultColor: "#00ff18" })
                                }
                            }
                            break;
                        case "oldFrontIDCard":
                            if (response.statusCode === "405") {
                                this.setState({ isErrorStatus: true })
                                this.setState({ faceErrorMes: true })
                                this.setState({ markSrc: failedURL })
                                this.setState({ resultColor: "red" })
                            } else {
                                if (response.statusCode === "200" && response.isValid) {
                                    this.setState({ isErrorStatus: false })
                                    this.setState({ markSrc: successURL })
                                    this.setState({ resultColor: "#00ff18" })
                                } else if (response.statusCode === "400") {
                                    this.setState({ isErrorStatus: true })
                                    this.setState({ mrzErrorMes: true })
                                    this.setState({ markSrc: failedURL })
                                    this.setState({ resultColor: "red" })
                                } else {
                                    this.setState({ isErrorStatus: true })
                                    this.setState({ inputImgErrorMes: true })
                                    this.setState({ markSrc: failedURL })
                                    this.setState({ resultColor: "red" })
                                }
                            }
                            break;
                        case "oldBackIDCard":
                            this.setState({ isErrorStatus: false })
                            this.setState({ markSrc: successURL })
                            this.setState({ resultColor: "#00ff18" })
                            break;
                        case "oldFrontResident":
                            if (response.statusCode === "405") {
                                this.setState({ isErrorStatus: true })
                                this.setState({ faceErrorMes: true })
                                this.setState({ markSrc: failedURL })
                                this.setState({ resultColor: "red" })
                            } else {
                                if (response.statusCode === "200") {
                                    this.setState({ isErrorStatus: false })
                                    this.setState({ markSrc: successURL })
                                    this.setState({ resultColor: "#00ff18" })
                                } else if (response.statusCode === "400") {
                                    this.setState({ isErrorStatus: true })
                                    this.setState({ mrzErrorMes: true })
                                    this.setState({ markSrc: failedURL })
                                    this.setState({ resultColor: "red" })
                                } else {
                                    this.setState({ isErrorStatus: true })
                                    this.setState({ inputImgErrorMes: true })
                                    this.setState({ markSrc: failedURL })
                                    this.setState({ resultColor: "red" })
                                }
                            }
                            break;
                        case "oldBackResident":
                            this.setState({ isErrorStatus: false })
                            this.setState({ markSrc: failedURL })
                            this.setState({ resultColor: "red" })
                            break;
                        default:
                            console.log("dddd")
                            break;
                    }
                }

            } catch (error) {
                this.setState({ isMrzLoading: false })
                this.setState({ alertMessage: "The server is not working, please try again." })
                this.setState({ alertOpen: true })
                this.onReTake()
            }
        })
    }
    onTake = () => {
        this.setState({ isDeviceComponent: true })
        this.onUploadDeviceFeatures()
    }
    onUploadDeviceFeatures = () => {
        this.setState({ isMrzLoading: true })
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
        var activityName = ""
        let { IDTarget } = this.state
        switch (IDTarget) {
            case "frontIDCard":
                activityName = "activity_3"
                break;
            case "passport":
                if (window.surpportedDocType == "PA") {
                    if (window.checkType === "CHECKID_L3") {
                        activityName = "activity_3"
                    } else if (window.checkType === "CHECKID_L1" || window.checkType === "CHECKID_L2") {
                        activityName = "activity_end"
                    }
                } else {
                    activityName = "activity_3"
                }
                break;
            case "frontResident":
                activityName = "activity_3"
                break;
            case "backIDCard":
                if (window.surpportedDocType == "PAID") {
                    if (window.checkType === "CHECKID_L3") {
                        activityName = "activity_4"
                    } else if (window.checkType === "CHECKID_L1" || window.checkType === "CHECKID_L2") {
                        activityName = "activity_end"
                    }
                } else {
                    activityName = "activity_4"
                }
                break;
            case "backResident":
                if (window.checkType === "CHECKID_L3") {
                    activityName = "activity_4"
                } else if (window.checkType === "CHECKID_L1" || window.checkType === "CHECKID_L2") {
                    activityName = "activity_end"
                }
                break;
            case "oldFrontIDCard":
                activityName = "activity_3"
                break;
            case "oldBackIDCard":
                if (window.surpportedDocType == "PAID") {
                    if (window.checkType === "CHECKID_L3") {
                        activityName = "activity_4"
                    } else if (window.checkType === "CHECKID_L1" || window.checkType === "CHECKID_L2") {
                        activityName = "activity_end"
                    }
                } else {
                    activityName = "activity_4"
                }
                break;
            case "oldFrontResident":
                activityName = "activity_3"
                break;
            case "oldBackResident":
                if (window.checkType === "CHECKID_L3") {
                    activityName = "activity_4"
                } else if (window.checkType === "CHECKID_L1" || window.checkType === "CHECKID_L2") {
                    activityName = "activity_end"
                }
                break;
            default:
                console.log("dddd")
                break;
        }
        var data = {
            checkId: window.checkId,
            applicantId: window.applicantId,
            env: window.env,
            activityName: activityName,
            isBot: window.isBot,
            isIncognitoMode: false,
            deviceType: "BROWSER",
            browserComponents: aesEncryption,
            encryptedAESKey: encryptedAesKey
        }
        ApiService.uploadDoc('post', url, data, window.api_access_token, (res) => {
            try {
                this.setState({ isDeviceComponent: false })
                console.log(res.data)
                this.setState({ isMrzLoading: false })
                this.setState({ blurErrorMes: false })
                this.setState({ glareErrorMes: false })
                this.setState({ faceErrorMes: false })
                this.setState({ mrzErrorMes: false })
                this.setState({ inputImgErrorMes: false })
                this.setState({ isMrzProcessing: false })
                this.setState({ isMrzLoading: false })
                // this.setState({ spamIDCardError: false })
                let { IDTarget } = this.state
                switch (IDTarget) {
                    case "frontIDCard":
                        this.setState({ isHelp: true })
                        this.setState({ helpImgSrc: backCardHelpURL })
                        this.setState({ helpTitle: t('idDocHelp.backIDTitle') })
                        this.setState({ helpHeaderTitle: t('idDocHelp.backIDHeaderTitle') })
                        this.setState({ IDTarget: "backIDCard" })
                        this.setState({ Mode: "BACK" })
                        this.setState({ titleMessage: t('idDocumentCamera.idTitle') })
                        this.setState({ idTitle: t('idDocumentCamera.backIDTitle') })
                        this.setState({ message: t('idDocumentCamera.backIDMes') })
                        this.setState({ previewImageStatuse: false })
                        window.FrontIDCardPath = this.state.croppedImageBase64
                        // localStorage.setItem("FrontIDCardPath", this.state.IDDocImgURL)
                        break;
                    case "passport":
                        if (window.surpportedDocType == "PA") {
                            window.PassportPath = this.state.croppedImageBase64
                            window.PassportCountry = window.countryName
                            if (window.checkType === "CHECKID_L3") {
                                this.props.history.push('poadoc')
                            } else if (window.checkType === "CHECKID_L1" || window.checkType === "CHECKID_L2") {
                                this.props.history.push('iddocresult')
                            }
                        } else {
                            window.PassportPath = this.state.croppedImageBase64
                            window.PassportCountry = window.countryName
                            this.props.history.push('idmain')
                        }
                        break;
                    case "frontResident":
                        this.setState({ isHelp: true })
                        this.setState({ helpImgSrc: backCardHelpURL })
                        this.setState({ helpTitle: t('idDocHelp.backIDTitle') })
                        this.setState({ helpHeaderTitle: t('idDocHelp.backIDHeaderTitle') })
                        this.setState({ IDTarget: "backResident" })
                        this.setState({ Mode: "BACK" })
                        this.setState({ titleMessage: t('idDocumentCamera.residentTitle') })
                        this.setState({ idTitle: t('idDocumentCamera.backResidentTitle') })
                        this.setState({ message: t('idDocumentCamera.backResidentMes') })
                        this.setState({ previewImageStatuse: false })
                        window.FrontResidentPath = this.state.croppedImageBase64
                        break;
                    case "backIDCard":
                        // this.setState({ mrzDetectFlag: false })
                        if (window.surpportedDocType == "PAID") {
                            window.BackIDCardPath = this.state.croppedImageBase64
                            window.IDCardCountry = window.countryName
                            if (window.checkType === "CHECKID_L3") {
                                this.props.history.push('poadoc')
                            } else if (window.checkType === "CHECKID_L1" || window.checkType === "CHECKID_L2") {
                                this.props.history.push('iddocresult')
                            }
                        } else {
                            window.BackIDCardPath = this.state.croppedImageBase64
                            window.IDCardCountry = window.countryName
                            this.props.history.push('idmain')
                        }
                        break;
                    case "backResident":
                        // this.setState({ mrzDetectFlag: false })                                                                
                        window.BackResidentPath = this.state.croppedImageBase64
                        window.ResidentCountry = window.countryName
                        if (window.checkType === "CHECKID_L3") {
                            this.props.history.push('poadoc')
                        } else if (window.checkType === "CHECKID_L1" || window.checkType === "CHECKID_L2") {
                            this.props.history.push('iddocresult')
                        }
                        break;
                    case "oldFrontIDCard":
                        this.setState({ isHelp: true })
                        this.setState({ helpImgSrc: backCardHelpURL })
                        this.setState({ helpTitle: t('idDocHelp.backIDTitle') })
                        this.setState({ helpHeaderTitle: t('idDocHelp.backIDHeaderTitle') })
                        this.setState({ IDTarget: "oldBackIDCard" })
                        this.setState({ Mode: "BACK" })
                        this.setState({ titleMessage: t('idDocumentCamera.idTitle') })
                        this.setState({ idTitle: t('idDocumentCamera.backIDTitle') })
                        this.setState({ message: t('idDocumentCamera.backIDMes') })
                        this.setState({ previewImageStatuse: false })
                        window.FrontIDCardPath = this.state.croppedImageBase64
                        break;
                    case "oldBackIDCard":
                        if (window.surpportedDocType == "PAID") {
                            window.BackIDCardPath = this.state.croppedImageBase64
                            window.IDCardCountry = window.countryName
                            if (window.checkType === "CHECKID_L3") {
                                this.props.history.push('poadoc')
                            } else if (window.checkType === "CHECKID_L1" || window.checkType === "CHECKID_L2") {
                                this.props.history.push('iddocresult')
                            }
                        } else {
                            window.BackIDCardPath = this.state.croppedImageBase64
                            window.IDCardCountry = window.countryName
                            this.props.history.push('idmain')
                        }
                        break;
                    case "oldFrontResident":
                        this.setState({ isHelp: true })
                        this.setState({ helpImgSrc: backCardHelpURL })
                        this.setState({ helpTitle: t('idDocHelp.backIDTitle') })
                        this.setState({ helpHeaderTitle: t('idDocHelp.backIDHeaderTitle') })
                        this.setState({ IDTarget: "oldBackResident" })
                        this.setState({ Mode: "BACK" })
                        this.setState({ titleMessage: t('idDocumentCamera.residentTitle') })
                        this.setState({ idTitle: t('idDocumentCamera.backResidentTitle') })
                        this.setState({ message: t('idDocumentCamera.backResidentMes') })
                        this.setState({ previewImageStatuse: false })
                        window.FrontResidentPath = this.state.croppedImageBase64
                        break;
                    case "oldBackResident":
                        window.BackResidentPath = this.state.croppedImageBase64
                        window.ResidentCountry = window.countryName
                        if (window.checkType === "CHECKID_L3") {
                            this.props.history.push('poadoc')
                        } else if (window.checkType === "CHECKID_L1" || window.checkType === "CHECKID_L2") {
                            this.props.history.push('iddocresult')
                        }
                        break;
                    default:
                        console.log("dddd")
                        break;
                }
            } catch (error) {
                this.setState({ isDeviceComponent: false })
                this.setState({ alertMessage: "The server is not working, please try again." })
                this.setState({ alertOpen: true })
            }
        })
    }
    onReTake = () => {
        this.setState({ previewImageStatuse: false })
        this.setState({ isErrorStatus: false })
        this.setState({ isMrzLoading: false })
        this.setState({ isMrzProcessing: false })

        this.setState({ imgQualityErrorMes: false })
        this.setState({ faceErrorMes: false })
        this.setState({ inputImgErrorMes: false })

        let { IDTarget } = this.state
        switch (IDTarget) {
            case "frontIDCard":
                this.setState({ mrzErrorMes: false })
                this.setState({ message: t('idDocumentCamera.frontIDMes') })
                this.setState({ idTitle: t('idDocumentCamera.frontIDTitle') })
                break;
            case "passport":
                if (this.state.mrzErrorMes) {
                    this.props.history.push('documentcountry')
                } else {
                    this.setState({ message: t('idDocumentCamera.passportMes') })
                    this.setState({ idTitle: t('idDocumentCamera.passportTitle') })
                }
                this.setState({ mrzErrorMes: false })
                break;
            case "frontResident":
                this.setState({ mrzErrorMes: false })
                this.setState({ message: t('idDocumentCamera.frontResidentMes') })
                this.setState({ idTitle: t('idDocumentCamera.frontResidentTitle') })
                break;
            case "backIDCard":
                if (this.state.mrzErrorMes) {
                    this.props.history.push('documentcountry')
                } else {
                    this.setState({ message: t('idDocumentCamera.backIDMes') })
                    this.setState({ idTitle: t('idDocumentCamera.backIDTitle') })
                }
                this.setState({ mrzErrorMes: false })
                break;
            case "backResident":
                if (this.state.mrzErrorMes) {
                    this.props.history.push('documentcountry')
                } else {
                    this.setState({ message: t('idDocumentCamera.backResidentMes') })
                    this.setState({ idTitle: t('idDocumentCamera.backResidentTitle') })
                }
                this.setState({ mrzErrorMes: false })
                break;
            case "oldFrontIDCard":
                if (this.state.mrzErrorMes) {
                    this.props.history.push('documentcountry')
                } else {
                    this.setState({ message: t('idDocumentCamera.frontIDMes') })
                    this.setState({ idTitle: t('idDocumentCamera.frontIDTitle') })
                }
                this.setState({ mrzErrorMes: false })
                break;
            case "oldBackIDCard":
                this.setState({ message: t('idDocumentCamera.backIDMes') })
                this.setState({ idTitle: t('idDocumentCamera.backIDTitle') })
                this.setState({ mrzErrorMes: false })
                break;
            case "oldFrontResident":
                if (this.state.mrzErrorMes) {
                    this.props.history.push('documentcountry')
                } else {
                    this.setState({ message: t('idDocumentCamera.frontResidentMes') })
                    this.setState({ idTitle: t('idDocumentCamera.frontResidentTitle') })
                }
                this.setState({ mrzErrorMes: false })
                break;
            case "oldBackResident":
                this.setState({ message: t('idDocumentCamera.backResidentMes') })
                this.setState({ idTitle: t('idDocumentCamera.backResidentTitle') })
                break;
            default:
                console.log("dddd")
                break;
        }
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
    onContinue = () => {
        console.log("continue button clicked")
        this.setState({ isHelp: false })
    }
    onCloseAlert = () => {
        this.setState({ alertOpen: false })
    }

    render() {
        return (
            <div style={{ width: "100%", height: window.innerHeight }}>
                <canvas id="canvas" />
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
                {(this.state.previewImageStatuse) &&
                    <div className="IDDocCamCrop-container" style={{ height: window.innerHeight }}>
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
                    <div style={{ height: window.innerHeight * 0.07, background: this.state.backgroundColor, opacity: "0.9" }}>
                        <div style={{ width: "100%", height: window.innerHeight * 0.07, alignItems: "center", display: "flex", background: "" }}>
                            <img src={this.state.backButtonSRC} style={{ width: "12px", height: "12px", marginLeft: "10px" }}
                                onClick={this.onOpenModal} />
                            <p style={{ width: "60%", color: this.state.txtColor, marginLeft: "10px", fontWeight: "bold", fontSize: "18px", marginBottom: "0px" }}>{this.state.idTitle}</p>
                            <p style={{ color: this.state.txtColor, marginLeft: "auto", marginRight: "10px" }}>{window.countryName}</p>
                        </div>
                    </div>
                    <div style={{ height: window.innerHeight * 0.44, display: "flex", backgroundImage: `url(${this.state.idCardSRC})`, backgroundSize: "100% 100%" }} >
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Loader
                                type="Oval"
                                color={window.buttonBackgroundColor}
                                height={100}
                                width={100}
                                visible={this.state.isMrzLoading}
                            />
                        </div>
                    </div>
                    <div style={{ height: window.innerHeight * 0.49, background: this.state.backgroundColor, opacity: "0.9" }}>
                        {(!this.state.isErrorStatus) && <div className="IDMessage-Container" >
                            <img src={this.state.errorSRC} />
                            <p className="IDDocCamMeassage" style={{ color: this.state.txtColor }}>{this.state.message}</p>
                        </div>}
                        {(!this.state.previewImageStatuse) &&
                            <div className="IDCapture-Container" style={{ marginTop: window.innerHeight * 0.11, background: this.state.backgroundColor }}>
                                {(!this.state.isLoading) &&
                                    <Button
                                        backgroundColor={window.buttonBackgroundColor}
                                        buttonTextColor={window.buttonTextColor}
                                        label={t('idDocumentCamera.takePictureButton')}
                                        onClick={this.onCapture}
                                    />}
                                <p className="bottomTitle" style={{ color: this.state.txtColor }}>Powerd by BIOMIID</p>
                            </div>}
                    </div>
                </div>
                {(this.state.previewImageStatuse) && this.state.isMrzProcessing &&
                    <div className="IDDocCam_PreviewContainer" style={{ height: window.innerHeight }}>
                        <div style={{ height: window.innerHeight * 0.07, background: "#7f00ff" }}>
                            <div style={{ width: "100%", height: window.innerHeight * 0.07, alignItems: "center", display: "flex", background: "white" }}>
                                <img src={this.state.previewBackSrc} style={{ width: "15px", height: "15px", marginLeft: "10px" }}
                                    onClick={this.onOpenModal} />
                                <p style={{ width: "60%", color: "gray", marginLeft: "10px", fontWeight: "bold", fontSize: "18px", marginBottom: "0px" }}>{this.state.idTitle}</p>
                                <p style={{ color: "gray", marginLeft: "auto", marginRight: "10px" }}>{window.countryName}</p>
                            </div>
                            <div style={{ height: window.innerHeight * 0.44, display: "flex", background: this.state.previewBackColor, alignItems: "center", justifyContent: "center" }} >
                                <img id="imageID" src={this.state.croppedImageUrl} style={{ width: "95%", height: window.innerHeight * 0.4, border: "3px solid", borderColor: this.state.resultColor, padding: "5px", borderRadius: "4px" }} />
                            </div>
                            <div className="idDocCamResult_mark" style={{ paddingTop: window.innerHeight * 0.07, height: window.innerHeight * 0.44 }}>
                                <img src={this.state.markSrc} className="imgMark" />
                            </div>
                            <div style={{ height: window.innerHeight * 0.49, background: this.state.previewBackColor, marginTop: "-10px" }}>
                                {(!this.state.isErrorStatus) && <div className="IDMessage-Container" >
                                    <img src={this.state.warringSRC} />
                                    <p className="IDDocCamMeassage" style={{ color: "gray" }}>{this.state.message}</p>
                                </div>}
                                {(this.state.isErrorStatus) && <div className="errorMessageView" style={{ bottom: window.innerHeight * 0.13 }}>
                                    <div className="container" style={{ border: "1px solid #7f00ff" }}>
                                        <div className="errortitle">
                                            <img src={this.state.warringSRC} />
                                            <p style={{ color: "gray" }}>{t('errorMessageTitle')}</p>
                                        </div>
                                        <div className="errormessage">
                                            {(this.state.imgQualityErrorMes) && <p style={{ marginBottom: "3px", color: "gray" }}> {this.state.imageQualityErrorMessage} </p>}
                                            {(this.state.faceErrorMes) && <p style={{ marginBottom: "3px", color: "gray" }}> {t('faceErrorMes')} </p>}
                                            {(this.state.mrzErrorMes) && <p style={{ marginBottom: "3px", color: "gray" }}> {t('mrzErrorMes')} </p>}
                                            {(this.state.inputImgErrorMes) && <p style={{ marginBottom: "3px", color: "gray" }}> {t('inputImgErrorMes')} </p>}
                                        </div>
                                    </div>
                                </div>}
                                <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "30px" }}>
                                    <Loader
                                        type="Oval"
                                        color={window.buttonBackgroundColor}
                                        height={80}
                                        width={80}
                                        visible={this.state.isDeviceComponent}
                                    />
                                </div>
                                {(this.state.previewImageStatuse) && this.state.isMrzProcessing &&
                                    <div className="ButtonPreview" style={{ background: this.state.previewBackColor }}>
                                        <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                                            <div style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px" }}>
                                                <ReTakeButton
                                                    label={t('idDocumentCamera.reTakeButton')}
                                                    onClick={this.onReTake} />
                                            </div>
                                            {(!this.state.isErrorStatus) && <div style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px" }}>
                                                <Button
                                                    backgroundColor={window.buttonBackgroundColor}
                                                    buttonTextColor={window.buttonTextColor}
                                                    label={t('idDocumentCamera.photoClearButton')}
                                                    onClick={this.onTake}
                                                />
                                            </div>}

                                        </div>
                                        {/* <Base64Downloader base64={this.state.croppedImageBase64} downloadName="croppedImage">
                                            Click to download
                                                </Base64Downloader> */}
                                        <p className="bottomTitle" style={{ color: "gray" }}>Powerd by BIOMIID</p>
                                    </div>}
                            </div>
                        </div>
                    </div>}
                {this.state.isHelp && <div className="idDocHelp_Container" style={{ height: window.innerHeight }}>
                    <Header headerText={this.state.helpHeaderTitle} headerBackgroundColor={this.state.headerColor} url="photolivness" txtColor={window.headerTextColor} />
                    <div className="main_Container" style={{ marginTop: window.innerHeight * 0.05 }}>
                        <p style={{ color: window.pageTextColor }}>{this.state.helpTitle}</p>
                        <img src={this.state.helpImgSrc} alt="Id card help image" style={{ width: "80%", height: this.state.imageHeight }} />
                    </div>
                    <div className="idDocHelp_message">
                        <img src={this.state.warringSRC} style={{ width: "20px", height: "20px" }} />
                        <p style={{ color: window.pageTextColor }}>{t('idDocHelp.message')}</p>
                    </div>
                    <div className="buttonView" style = {{bottom:this.state.bottomMargin}}>
                        <Button
                            backgroundColor={window.buttonBackgroundColor}
                            buttonTextColor={window.buttonTextColor}
                            label={t('idDocHelp.buttonTitle')}
                            onClick={() => this.onContinue()} />
                    </div>
                    <p className="footerTitle" style={{ color: window.pageTextColor }}>Powerd by BIOMIID</p>
                </div>}
                <Modal open={this.state.modalOpen} showCloseIcon={false} center>
                    <div className="modalView" style={{ height: window.innerHeight * 0.3 }}>
                        <div>
                            <p style={{ color: "gray", fontSize: "18px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px" }}>Are you sure you want to exit the identification process?</p>
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
export default withTranslation(IDDocCmamera);