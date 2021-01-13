import React, { Component } from 'react';
import Header from "../../Components/whiteHeader/whiteHeader"
import SuccessURL from "../../assets/ic_upload_check.png"
import Button from '../../Components/POAButton/POAButton'
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
            txtMarginBottom: null
        }
    }
    componentDidMount = () => {
        if (window.innerHeight > 600) {
            this.setState({ topMargin: window.innerHeight * 0.1 })
            this.setState({ txtMarginBottom: "35px" })

        } else if (window.innerHeight < 600) {
            this.setState({ topMargin: window.innerHeight * 0.05 })
            this.setState({ txtMarginBottom: "0px" })
        }

    }
    onClose = () => {
        window.open('https://www.biomiid.com')
    }
    render() {
        return (
            <div>
                {/* <Header headerText={this.state.sendHeaderText} txtColor={this.state.txtColor} /> */}
                <div className="result-body-container">
                    <div className="uploadResultMesView" style={{ marginTop: this.state.topMargin }}>
                        <p className="txtLivnessResult" style={{ color: this.state.txtColor, marginBottom: this.state.txtMarginBottom }}> {t('idDocResult.resultMessage')} </p>
                        <p className="message" style={{ color: this.state.txtColor }}>{t('idDocResult.message')}</p>
                    </div>
                    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: this.state.topMargin }}>
                        <img src={this.state.imgSrc} className="uploadResultMark" style={{ height: window.innerHeight * 0.3 }} />
                    </div>
                    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", position: "absolute", bottom: "25px" }}>
                        <Button
                            label={t('idDocResult.buttonTitle')}
                            onClick={this.onClose}
                        />
                        <p style={{ marginTop: "10px", color: this.state.txtColor }}>Powerd by BIOMIID RapidCheck</p>
                    </div>



                </div>
            </div>
        )
    }
}
export default withTranslation(Result);