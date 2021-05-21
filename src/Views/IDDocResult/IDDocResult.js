import React, { Component } from 'react';
import Header from "../../Components/header/header"
import SuccessURL from "../../assets/ic_success.png"
import Button from '../../Components/POAButton/POAButton'
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import ApiService from '../../Services/APIServices'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import './IDDocResult.css'
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'
let lan = localStorage.getItem('language');
setDefaultLanguage(lan)

var openWindow;
var count = 0;

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
            message: "",
            alertMessage: "",
            alertOpen: false
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

        setTimeout(() => {
            this.onInitCheckSession()
        }, 5000);
    }
    onInitCheckSession = () => {
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
                var checkResult = response.checkResult
                var statusCode = response.statusCode
                this.setState({ isStatus: true })
                // alert(JSON.stringify(response))
                if (statusCode === "401") {
                    this.setState({ alertMessage: response.message })
                    this.setState({ alertOpen: true })
                } else {
                    if (checkStatus === "COMPLETED") {
                        if (checkResult === "PASSED") {
                            this.setState({ message: t('idDocResult.passedMessage') })
                        } else {
                            this.setState({ message: t('idDocResult.otherMessage') })
                        }
                    } else {
                        // this.setState({message: t('idDocResult.otherMessage')})
                        if (count < 3) {
                            setTimeout(() => {
                                this.onInitCheckSession()
                                count++
                            }, 2000);
                        }

                    }
                }

            } catch (error) {
                this.setState({ alertMessage: "the server is not working, Please try again." })
                this.setState({ alertOpen: true })
            }
        })
    }
    onClose = () => {
        this.props.history.push('/blank')
    }
    onCloseAlert = () => {
        this.setState({ alertOpen: false })
    }
    render() {
        return (
            <div>
                <Header headerBackground={this.state.headerColor} />
                <div className="result-body-container" style={{ background: this.state.background }}>
                    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: this.state.topMargin }}>
                        {this.state.isStatus && <img src={this.state.imgSrc} className="uploadResultMark" style={{ width: "100px", height: "100px" }} />}
                        {!this.state.isStatus && <div className="iddocResult_loader">
                            <Loader
                                type="Oval"
                                color={window.buttonBackgroundColor}
                                height={80}
                                width={80}
                                visible={this.state.apiFlage}
                            />
                            <p style={{ color: window.buttonBackgroundColor }}>Pending...</p>
                        </div>}
                    </div>
                    {this.state.isStatus && <div className="uploadResultMesView" style={{ marginTop: this.state.topMargin }}>
                        <p className="txtLivnessResult" style={{ color: this.state.txtColor, marginBottom: this.state.txtMarginBottom }}> {t('idDocResult.resultMessage')} </p>
                        <p className="clientName" style={{ color: this.state.txtColor,textAlign:"center" }}>The verification process is completed</p>
                        <p className="message" style={{ color: this.state.txtColor,textAlign:"center" }}>{this.state.message}</p>
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
export default withTranslation(Result);