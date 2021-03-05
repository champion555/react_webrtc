import React, { Component } from 'react';
import axios from 'axios'
import Header from "../../Components/whiteHeader/whiteHeader"
import ApiService from '../../Services/APIServices'
import Loader from 'react-loader-spinner'
import Button from '../../Components/POAButton/POAButton'
import ReactCodeInput from "react-code-input"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import {Config} from '../../Services/Config'
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'

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
                    this.onGetClientDetails()
                    // alert("Digits code already used!")
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
                this.setState({ isKeyValidation: false })
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
                    // this.props.history.push('home')
                    this.props.history.push('documentcountry')
                }
            } catch (error) {
                this.setState({ isKeyValidation: false })
                console.log("error:", error)
                alert("The server is not working, please try again")
            }
        })
    }
    render() {
        var { score, threshold, message } = this.state;
        return (
            <div>
                {/* <Header headerText={t('session.title')} headerBackgroundColor={this.state.headerColor} txtColor={this.state.headerTitlecolor} /> */}
                <div className="validation_container" style={{ height: window.innerHeight }}>
                    <div className="pinCodeView" style={{ paddingTop: window.innerHeight * 0.2 }}>
                        <p>Please enter your 8 digits code</p>
                        <ReactCodeInput type='number' fields={8} disabled={!this.state.isValidation} onChange={(value) => this.getPinCode(value)} />
                    </div>
                    <div className="loaderView">
                        {!this.state.isValidation && <Loader
                            type="Oval"
                            color="#7f00ff"
                            height={80}
                            width={80}
                            visible={this.state.apiFlage}
                        />}
                        {this.state.isKeyValidation && <Loader
                            type="Oval"
                            color="#7f00ff"
                            height={80}
                            width={80}
                            visible={this.state.apiFlage}
                        />}
                    </div>
                    <div className="buttonView">
                        <Button
                            label={t('documentCountry.continueButton')}
                            onClick={() => this.onContinue()} />
                    </div>
                </div>
            </div>
        )
    }
}
export default ValidationPage;