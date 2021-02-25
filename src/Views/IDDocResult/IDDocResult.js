import React, { Component } from 'react';
import Header from "../../Components/header/header"
import SuccessURL from "../../assets/ic_success.png"
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
        // window.open('https://www.biomiid.com')
        this.props.history.push('')
    }
    render() {
        return (
            <div>
                <Header/>
                <div className="result-body-container">
                    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: this.state.topMargin }}>
                        <img src={this.state.imgSrc} className="uploadResultMark" style={{ width:"100px", height:"100px"}} />
                    </div>
                    <div className="uploadResultMesView" style={{ marginTop: this.state.topMargin }}>
                        <p className="txtLivnessResult" style={{ color: this.state.txtColor, marginBottom: this.state.txtMarginBottom }}> {t('idDocResult.resultMessage')} </p>
                        <p className = "clientName" style = {{color:this.state.txtColor}}>Ghislain Bienvenu MAMAT</p>
                        <p className="message" style={{ color: this.state.txtColor }}>{t('idDocResult.message')}</p>
                    </div>
                    <div className = "buttonPreview">
                        <Button
                            label={t('idDocResult.buttonTitle')}
                            onClick={this.onClose}
                        />
                        <p style={{ marginTop: "10px", color: this.state.txtColor }}>Powerd by BIOMIID</p>
                    </div>
                </div>
            </div>
        )
    }
}
export default withTranslation(Result);