import React, { Component } from 'react';
import Header from "../../Components/whiteHeader/whiteHeader"
import SuccessURL from "../../assets/ic_success.png"
import FailedURL from "../../assets/ic_failed.png"
import UnableURL from "../../assets/ic_unable.png"
import livenssSampleUrl from "../../assets/ic_liveness_sample.png"
import Button from "../../Components/POAButton/POAButton"
import Base64Downloader from 'react-base64-downloader';
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'
import './LivenessResult.css'

let lan = localStorage.getItem('language');
setDefaultLanguage(lan)

class LivenessResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgSrc: SuccessURL,
            successSrc: SuccessURL,
            message: "",
            unableFlag: false,
            livenessSampleSrc: livenssSampleUrl,
            txtColor: "gray",
            livnessPreviewHeight: null,
            imageHeight: null,
            headerColor: "#7f00ff",
            headerTitleColor: "white",
            background:"white",
            buttonTitleColor: "white",
            buttonBackgroundColor: "#7f00ff"
        }
    }
    componentDidMount = () => {
        this.setState({headerColor:window.headerBackgroundColor})
        this.setState({headerTitleColor: window.headerTextColor})
        this.setState({background:window.pageBackgroundColor})
        this.setState({txtColor:window.pageTextColor})
        this.setState({buttonBackgroundColor:window.buttonBackgroundColor })
        this.setState({buttonTitleColor:window.buttonTextColor })
        // this.setState({ livnessPreviewHeight: window.innerHeight * 0.4 })
        // this.setState({ imageHeight: window.innerHeight * 0.35 })
        if (window.innerHeight > 600) {
            this.setState({ livnessPreviewHeight: window.innerHeight * 0.4 })
            this.setState({ imageHeight: window.innerHeight * 0.35 })
        } else {
            this.setState({ livnessPreviewHeight: window.innerHeight * 0.5 })
            this.setState({ imageHeight: window.innerHeight * 0.45 })
        }
        // if (window.livenessResult === "SPOOF") {
        //     this.setState({ imgSrc: FailedURL })
        //     this.setState({ message: t('livenessResult.spoofMessage') })
        // } else {
        //     this.setState({ imgSrc: UnableURL })
        //     this.setState({ message: t('livenessResult.unableMessage') })
        //     this.setState({ unableFlag: true })
        // }
        this.setState({ imgSrc: UnableURL })
        this.setState({ message: t('livenessResult.unconfirmMes') })

    }
    render() {
        return (
            <div>
                <Header headerBackgroundColor={this.state.headerColor} txtColor={this.state.headerTitleColor} />
                <div className="result-body-container" style = {{background:this.state.background}}>
                    <p className="txtLivnessResult" style={{ color: this.state.txtColor, marginTop: window.innerHeight * 0.04 }}> {this.state.message} </p>
                    <div style={{ width: "100%", height: this.state.livnessPreviewHeight, display: "flex", flexDirection: "row" }}>
                        <div className="livenessPreview" style={{ height: this.state.livnessPreviewHeight }}>
                            <img src={window.photoLivenessSrc} style={{ height: this.state.imageHeight, width: "100%", paddingLeft: "20px", paddingRight: "5px" }} />
                            <img src={this.state.imgSrc} style={{ width: "30px", height: "30px", marginTop: "-15px" }} />
                        </div>
                        <div className="livenessPreview" style={{ height: this.state.livnessPreviewHeight }}>
                            <img src={this.state.livenessSampleSrc} style={{ height: this.state.imageHeight, width: "100%", paddingLeft: "5px", paddingRight: "20px" }} />
                            <img src={this.state.successSrc} style={{ width: "30px", height: "30px", marginTop: "-15px" }} />
                        </div>
                    </div>

                    <div className="livenessErrorView" style={{ marginTop: window.innerHeight * 0.02 }}>
                        <p className="possibleResaon" style={{ color: this.state.txtColor }}>{t('livenessResult.possibleReason')}</p>
                        <div className="container">
                            <p style={{ marginBottom: "3px", color: this.state.txtColor }}> {t('livenessResult.glareErrorMes')}</p>
                            <p style={{ marginBottom: "3px", color: this.state.txtColor }}> {t('livenessResult.faceErrorMes')} </p>
                            <p style={{ color: this.state.txtColor }}> {t('livenessResult.spoofErrorMes')} </p>
                        </div>
                    </div>
                    <div className="liveness_Buttonpreview">
                        <Button
                            backgroundColor = {this.state.buttonBackgroundColor}
                            buttonTextColor = {this.state.buttonTitleColor}
                            label={t('livenessResult.retryButton')}
                            onClick={() => {
                                this.props.history.push('photoliveness');
                            }}
                        />
                        <p style={{ fontStyle: "italic", color: this.state.txtColor, marginTop: "20px" }}>Powerd by BIOMIID</p>
                    </div>
                    {/* <Base64Downloader base64={window.livenessImage} downloadName="faceLivenessImage">
                        Click to download
                    </Base64Downloader> */}

                </div>
            </div>)
    }
}
export default withTranslation(LivenessResult);