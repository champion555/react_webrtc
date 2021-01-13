import React, { Component } from 'react';
import { withRouter } from "react-router";
import Webcam from "react-webcam";
import Button from "../../Components/button/button"
import PreviewButton from "../../Components/POAPreveiwButton/POAPreviewButton"
import Header from "../../Components/whiteHeader/whiteHeader"
import errorURL from "../../assets/ic_error.png"
import poaURL from "../../assets/ic_poadocument.png"
import poaframeURL from "../../assets/ic_poaframe.png"
import './POADocumentCamera.css'
import { check_blur, check_blur_base64, check_glare_base64, check_face_base64, check_glare, check_face } from 'image-analitic-lib'
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'
let lan = localStorage.getItem('language');
setDefaultLanguage(lan)

class POADocumentCamera extends Component {
    constructor(props) {
        super(props);
        this.onCapture = this.onCapture.bind(this)
        this.state = {
            screenshot: null,
            errorIconURL: errorURL,
            previewImageStatuse: false,
            isErrorStatus: false,
            isLoading: false,
            poaSRC: poaframeURL,
            POAMessage: null,
            blurResult: null,
            glareResult: null,
            txtColor: 'gray',
            aspactRatio: null,
        }
    }
    componentDidMount = () => {
        this.onSetMessage()
        this.setState({ poaSRC: poaframeURL })
        const ratio = window.innerHeight / window.innerWidth
        this.setState({ aspactRatio: ratio })
    }
    onSetMessage = () => {
        this.setState({ POAMessage: t('poaDocumentCamera.message') })
    }
    onLoadedImage() {
        var b = check_blur('poaimageID');
        var g = check_glare('poaimageID')
        var f = check_face('poaimageID')
        this.setState({ blurResult: b.b })
        this.setState({ glareResult: g })
        if (b.b == true || g == true) {
            this.setState({ isErrorStatus: true })
        }
        console.log(b)
        console.log(g)
    }
    onCapture = () => {
        const imageSrc = this.webcam.getScreenshot();
        this.setState({ screenshot: imageSrc })
        console.log(this.state.screenshot)
        this.setState({ isLoading: true })
        this.setState({ previewImageStatuse: true })
        this.setState({ isLoading: false })
        this.setState({ poaSRC: poaURL })
        this.setState({ POAMessage: t('poaDocumentCamera.previewMessage') })
    };
    onReTake = () => {
        this.setState({ previewImageStatuse: false })
        this.setState({ isErrorStatus: false })
        this.setState({ poaSRC: poaframeURL })
        this.setState({ POAMessage: t('poaDocumentCamera.message') })
    }
    setRef = webcam => {
        this.webcam = webcam;
    };
    render() {
        const videoConstraints = {
            facingMode: "environment",
            aspectRatio: this.state.aspactRatio
        };
        return (
            <div style={{ width: "100%", height: window.innerHeight }}>
                <Header headerText={t('poaDocumentCamera.title')} txtColor={this.state.txtColor} />
                <div className="POADocumentCamera-Container" style={{ height: window.innerHeight - 50 }}>
                    {(!this.state.previewImageStatuse) &&
                        // <Webcam
                        //     audio={false}
                        //     mirrored={true}
                        //     mirrored={false}
                        //     ref={this.setRef}
                        //     screenshotFormat="image/jpeg"
                        //     imageSmoothing={true}
                        //     width={"90%"}
                        //     height={window.innerHeight - 50}
                        //     screenshotQuality={1.0}
                        //     videoConstraints={videoConstraints}
                        //     forceScreenshotSourceSize="flase" />
                        <Webcam
                            height={window.innerHeight - 50}
                            width={"100%"}
                            videoConstraints={{ facingMode: 'environment', aspectRatio: this.state.aspactRatio }}
                            ref={this.setRef} />
                    }
                    {(this.state.previewImageStatuse) && <img className="PreviewImage" id="poaimageID" src={this.state.screenshot} style={{ height: window.innerHeight - 50 }} onLoad={() => this.onLoadedImage()} />}
                </div>
                <div style={{ width: "100%", height: window.innerHeight - 50, position: "absolute", zIndex: "2", }}>
                    {(!this.state.isErrorStatus) && <div className="POAMessage-Container" style={{ height: "60px", marginTop: window.innerHeight * 0.6 }}>
                        <p className="POACamMeassage">{this.state.POAMessage}</p>
                    </div>}
                    {(this.state.isErrorStatus) && <div className="POAErrorMessageView" style={{ marginTop: window.innerHeight * 0.6 }}>
                        <div className="container">
                            <div className="errortitle">
                                <img src={this.state.errorIconURL} />
                                <p>{t('errorMessageTitle')}</p>
                            </div>
                            <div className="errormessage">
                                {(this.state.blurResult) && <p> {t('blurryErrorMes')} </p>}
                                {(this.state.glareResult) && <p> {t('glareErrorMes')} </p>}
                            </div>
                        </div>
                    </div>}
                    {(!this.state.previewImageStatuse) && <div className="POACapture-Container">
                        {(!this.state.isLoading) && <Button
                            label={t('poaDocumentCamera.takePictureButton')}
                            onClick={this.onCapture}
                        />}
                    </div>}
                    {(this.state.previewImageStatuse) && <div className="POAPreviewButton-Container">
                        <PreviewButton
                            label={t('poaDocumentCamera.retakeButton')}
                            onClick={this.onReTake}
                        />
                        {(!this.state.isErrorStatus) && <PreviewButton
                            label={t('poaDocumentCamera.continueButton')}
                            onClick={() => {
                                window.POADocPath = this.state.ImageURL
                                this.props.history.push('iddocresult')
                            }}
                        />}

                    </div>}
                </div>


            </div>
        )
    }
}

export default withTranslation(POADocumentCamera);