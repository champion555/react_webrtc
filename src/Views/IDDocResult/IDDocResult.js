import React, { Component } from 'react';
import Header from "../../Components/header/header"
import SuccessURL from "../../assets/ic_success.png"
import Button from '../../Components/POAButton/POAButton'
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import ApiService from '../../Services/APIServices'
import './IDDocResult.css'
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'
let lan = localStorage.getItem('language');
setDefaultLanguage(lan)

var openWindow;

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sendHeaderText: t('idDocResult.title'),
            imgSrc: SuccessURL,
            txtColor: 'gray',
            topMargin: null,
            txtMarginBottom: null,
            background: "white",
            headerColor: "#7f00ff",
            isStatus: false,
        }
    }
    componentDidMount = () => {
        this.setState({ headerColor: window.headerBackgroundColor })
        this.setState({ headerTitleColor: window.headerTextColor })
        this.setState({ background: window.pageBackgroundColor })
        this.setState({ txtColor: window.pageTextColor })
        this.setState({ buttonBackgroundColor: window.buttonBackgroundColor })
        this.setState({ buttonTitleColor: window.buttonTextColor })

        if (window.innerHeight > 600) {
            this.setState({ topMargin: window.innerHeight * 0.1 })
            this.setState({ txtMarginBottom: "35px" })
        } else if (window.innerHeight < 600) {
            this.setState({ topMargin: window.innerHeight * 0.05 })
            this.setState({ txtMarginBottom: "0px" })
        }
        this.onInitCheckSession()       

    }
    onInitCheckSession = () => {
        // window.api_access_token = "ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SmhjR2xmYTJWNUlqb2lXbGRaTTA1NlZtbFphbFYwVFVSRk1VOVRNREJPVjFsNlRGUnJlbGxYVFhSTlZFSm9Ua2RGTVZwSFZtdE5la3BySWl3aWMyVmpjbVYwWDJ0bGVTSTZJazU2WXpWWlYwWnFUWHByZEUxSFJYaE5RekF3V1cxT2EweFVhM3BhUjBsMFRsUmthVnBYU1hkT01sRXpXVmRKTVNJc0ltVnVkaUk2SWxOQlRrUkNUMWdpTENKbGVIQWlPakUyTVRRNU16WXpNVE45Lkt2UGozNmE2a1VMcWZEMlhYRE1pVC1PaGYtek0wNEdFeEg1NmpISl9ONGM="
        // window.applicantId = "146e1eafc71a4b55acd60db241b1741b"
        // window.checkId = "71ae95e4247a4f71aa7d32133dde5e52"
        // window.env = "SANDBOX"
        var url = process.env.REACT_APP_BASE_URL + "client/check/initCheckSession"
        var data = {
            applicantId: window.applicantId,
            checkId: window.checkId,
            env: window.env
        }
        ApiService.uploadDoc('post', url, data, window.api_access_token, (res) => {
            try {                              
                var response = res.data;
                console.log(response)
                var checkStatus = response.checkStatus
                if(checkStatus === "COMPLETED"){
                    this.setState({isStatus: true})
                }else {
                    this.onGetStatus()
                }
            } catch (error) {
                alert("the server is not working, Please try again.");
            }
        })
    }
    onGetStatus = () => {
        var url = process.env.REACT_APP_BASE_URL + "client/check/getStatus"
        var data = {
            checkId: window.checkId,
            env: window.env
        }
        ApiService.uploadDoc('post', url, data, window.api_access_token, (res) => {
            try {                              
                var response = res.data;
                console.log(response)
                var checkStatus = response.checkStatus
                if(checkStatus === "COMPLETED"){
                    this.setState({isStatus: true})
                }else {
                    this.onGetStatus()
                }
            } catch (error) {
                alert("the server is not working, Please try again.");
            }
        })
    }
    onClose = () => {
        // window.open('https://www.biomiid.com')
        this.props.history.push('')
    }
    render() {
        return (
            <div>
                <Header headerBackground={this.state.headerColor} />
                <div className="result-body-container" style={{ background: this.state.background }}>
                    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: this.state.topMargin }}>
                        {this.state.isStatus && <img src={this.state.imgSrc} className="uploadResultMark" style={{ width: "100px", height: "100px" }} />}
                        {! this.state.isStatus && <div className="iddocResult_loader">
                            <Loader
                                type="Bars"
                                color={window.headerBackgroundColor}
                                height={80}
                                width={80}
                                visible={this.state.apiFlage}
                            />
                            <p style={{ color: this.state.headerColor }}>Pending...</p>
                        </div>}
                    </div>
                    {this.state.isStatus && <div className="uploadResultMesView" style={{ marginTop: this.state.topMargin }}>
                        <p className="txtLivnessResult" style={{ color: this.state.txtColor, marginBottom: this.state.txtMarginBottom }}> {t('idDocResult.resultMessage')} </p>
                        <p className="clientName" style={{ color: this.state.txtColor }}>Ghislain Bienvenu MAMAT</p>
                        <p className="message" style={{ color: this.state.txtColor }}>{t('idDocResult.message')}</p>
                    </div>}
                    {this.state.isStatus && <div className="buttonPreview">
                        <Button
                            backgroundColor={this.state.buttonBackgroundColor}
                            buttonTextColor={this.state.buttonTitleColor}
                            label={t('idDocResult.buttonTitle')}
                            onClick={this.onClose}
                        />
                        <p style={{ marginTop: "10px", color: this.state.txtColor }}>Powerd by BIOMIID</p>
                    </div>}
                </div>
            </div>
        )
    }
}
export default withTranslation(Result);