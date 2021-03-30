import React, { Component } from 'react';
import axios from 'axios'
import Header from "../../Components/whiteHeader/whiteHeader"
import ApiService from '../../Services/APIServices'
import Loader from 'react-loader-spinner'
import Button from '../../Components/POAButton/POAButton'
import ReactCodeInput from "react-code-input"
import imageUrl from  '../../assets/ic_logo2.png'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import {Config} from '../../Services/Config'
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'

import ClientJS from "clientjs"
import { stringify, v4 as uuidv4 } from 'uuid';
import { decrypt, encrypt, generateKeyFromString } from 'dha-encryption';
import { encryptRSA, decryptRSA, encryptionAES } from "../../Utils/crypto";
import './ValidationPage.css'

let lan = localStorage.getItem('language');
setDefaultLanguage(lan)

class ValidationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerColor: "#7f00ff",
            headerTitlecolor: "#fff",
            isValidation: false,
            isKeyValidation: false,
            txtPinCode: null,
            imgSrc: imageUrl
        }
    }
    componentDidMount() {
        console.log("config:",Config.host)
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let clientId = params.get('clientId');
        let applicantId = params.get('applicantId');
        let checkId = params.get('checkId')
        let checkType = params.get('checkType')
        let env = params.get('env')
        window.clientId = clientId
        window.applicantId = applicantId
        window.checkId = checkId
        window.checkType = checkType
        window.env = env
        console.log("clientId", window.clientId)
        console.log("applicantId", window.applicantId)
        console.log("checkId", window.checkId)
        console.log("checkType", window.checkType)
        console.log("env", window.env)
        if (checkId === null || applicantId === null || checkId === null || checkType === null || env === null) {
            console.log("null value detected")
            alert("This URL is wrong, Please use correct URL.")

        } else {
            console.log("API call in here")
            this.onCheckSessionIdValidation()
        }
    }
    onCheckSessionIdValidation = () => {
        var url = process.env.REACT_APP_BASE_URL + "client/checkSessionIdValidation"
        var data = {
            clientId: window.clientId,
            checkId: window.checkId,
            applicantId: window.applicantId,
            env: window.env
        }
        ApiService.apiCall('post', url, data, (res) => {
            try {
                console.log(res.data)
                var response = res.data
                var result = response.result
                if (result) {
                    this.setState({ isValidation: true })
                } else {
                    alert("Session is Expired!, please try again.")
                }
            } catch (error) {
                console.log("error:", error)
                alert("The server is not working, please try again")
            }
        })
    }
    getPinCode = (value) => {
        console.log(value)
        var length = value.length
        if (length === 8) {
            this.setState({ txtPinCode: value })
            console.log(value)
        }
    }
    onContinue = () => {
        if (this.state.txtPinCode != null) {
            this.onKeyValidation(this.state.txtPinCode)
        } else {
            alert("Please enter check Key for validation")
        }
    }
    onKeyValidation = (checkKey) => {
        this.setState({ isKeyValidation: true })
        var url = process.env.REACT_APP_BASE_URL + "checkKeyValidation"
        var data = {
            clientId: window.clientId,
            checkId: window.checkId,
            checkKey: checkKey,
            env: window.env
        }
        ApiService.apiCall('post', url, data, (res) => {
            try {
                console.log(res.data)                
                var response = res.data
                var result = response.result
                if (result === "VALID") {
                    console.log("Vald Code")
                    this.onGetClientDetails()                    
                } else {
                    // this.onGetClientDetails()
                    this.setState({ isKeyValidation: false })
                    alert("Digits code already used!")
                }
            } catch (error) {
                this.setState({ isKeyValidation: false })
                console.log("error:", error)
            }
        })
    }
    onGetClientDetails = () => {
        console.log(window.clientId)
        var url = process.env.REACT_APP_BASE_URL + "getClientDetails"
        var data = {
            clientId: window.clientId
        }
        ApiService.apiCall('post', url, data, (res) => {
            try {
                
                console.log(res.data)
                var response = res.data
                var status = response.status
                if (status === "SUCCESS"){
                    window.companyName = response.brand.companyName
                    window.logoImage  = response.brand.logoImage
                    window.buttonBackgroundColor = response.brand.buttonBackgroundColor
                    window.headerBackgroundColor = response.brand.headerBackgroundColor
                    window.pageBackgroundColor = response.brand.pageBackgroundColor
                    window.pageTextColor = response.brand.pageTextColor
                    window.buttonTextColor = response.brand.buttonTextColor
                    window.headerTextColor = response.brand.headerTextColor
                    window.websiteUrl = response.brand.websiteUrl
                    window.rsaPublic_key = response.rsaPublic_key
                    if(window.env === "SANDBOX"){
                        window.api_key = response.api_key_sandbox
                        window.secret_key = response.secret_key_sandbox
                    }else if(window.env === "LIVE"){
                        window.api_key = response.api_key_live
                        window.secret_key = response.secret_key_live
                    }                    
                    this.onGetAuthentication()
                    // this.props.history.push('documentcountry')
                }
            } catch (error) {
                this.setState({ isKeyValidation: false })
                console.log("error:", error)
                alert("The server is not working, please try again")
            }
        })
    }
    onGetAuthentication = () => {
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
                    this.onUploadDeviceFeatures()
                } else {
                    alert(response.message)
                }
            } catch (error) {
                console.log("error:", error)
                alert("The server is not working, please try again")
            }
        })
    }
    onUploadDeviceFeatures = () =>{
        var windowClient = new window.ClientJS();
        var canvasPrint = windowClient.getCanvasPrint()
        var customeFingerPrint = windowClient.getCustomFingerprint(canvasPrint);
        console.log("customeFingerPrint: ",customeFingerPrint)
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
        console.log("platform: ",platform)
        var data = {
                        fingerPrint:customeFingerPrint,
                        userAgent:userAgent,
                        browser:browser,
                        browserMajorVersion:browserMajorVersion,
                        engine:engine,
                        engineVersion:engineVersion,
                        osName:osName,
                        osVersion:osVersion,
                        deviceType:deviceType,
                        screenPrint:screenPrint,
                        colorDepth:colorDepth,
                        currentResolution:currentResolution,
                        availableResolution:availableResolution,
                        localStorage:localStorage,
                        sessionStorage:sessionStorage,
                        timezone:timezone,
                        language:language,
                        systemLanguage:systemLanguage,
                        canvasPrint:canvasPrint,
                        webGLVendor:webGLVendor,
                        webGLRenderer:webGLRenderer,
                        platform:platform
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
        var aesEncryption = encryptionAES(base64, aesKey)
        console.log("aesEnctryption: ", aesEncryption)
        var url = process.env.REACT_APP_BASE_URL + "client/collectDeviceFeatures"
        var data = {
            checkId: window.checkId,
            applicantId: window.applicantId,
            env: window.env,
            activityName: "activity_1",
            isBot: window.isBot,
            isIncognitoMode: false,
            deviceType: "BROWSER",
            browserComponents:aesEncryption,
            encryptedAESKey:encryptedAesKey
        }
        ApiService.uploadDoc('post', url, data, window.api_access_token, (res) => {
            try {
                this.setState({ isKeyValidation: false })
                console.log(res.data)
                this.setState({ apiFlage: false })
                var response = res.data;
                this.props.history.push('home')
                // this.props.history.push('poadoc')
            } catch (error) {
                this.setState({ isKeyValidation: false })
                alert("the server is not working, Please try again.");
            }
        })
    }
    
    render() {
        var { score, threshold, message } = this.state;
        return (
            <div>
                <canvas id="canvas" />
                {/* <Header headerText={t('session.title')} headerBackgroundColor={this.state.headerColor} txtColor={this.state.headerTitlecolor} /> */}
                <div className="validation_container" style={{ height: window.innerHeight }}>
                    <div className="pinCodeView" style={{ paddingTop: window.innerHeight * 0.1 }}>
                        <img src = {this.state.imgSrc} style = {{widows:"120px", height:"90px"}}/>
                        <p style = {{marginTop:"50px"}}>Please enter your 8 digits code</p>
                        <ReactCodeInput type='number' fields={8} disabled={!this.state.isValidation} 
                        onChange={(value) => this.getPinCode(value)} />
                    </div>
                    <div className="loaderView">
                        {!this.state.isValidation && <Loader
                            type="Oval"
                            color="#7133ff"
                            height={80}
                            width={80}
                            visible={this.state.apiFlage}
                        />}
                        {this.state.isKeyValidation && <Loader
                            type="Oval"
                            color="#7133ff"
                            height={80}
                            width={80}
                            visible={this.state.apiFlage}
                        />}
                    </div>
                    <div className="buttonView">
                        <Button
                            label={"CONTINUE"}
                            onClick={() => this.onContinue()} />
                    </div>
                </div>
            </div>
        )
    }
}
export default ValidationPage;


