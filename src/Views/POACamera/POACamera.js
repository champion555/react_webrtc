import React, { Component, createRef } from 'react';
import { Camera } from "react-camera-pro";
import Button from "../../Components/POAButton/POAButton"
import errorURL from "../../assets/ic_error.png"
import { check_blur, check_blur_base64, check_glare_base64, check_face_base64, check_glare, check_face } from 'image-analitic-lib'
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'
import './POACamera.css'
import header from '../../Components/header/header';
let lan = localStorage.getItem('language');
setDefaultLanguage(lan)


class POACamera extends Component {
    constructor(props) {
        super(props);
        this.webcamRef = React.createRef();
        this.state = {
            cameraRatio: null,
            capturedImageSrc: null,
            errorSRC: errorURL,
            previewImageStatuse: false,
            POAMessage: null,
            isErrorStatus: false,
            blurResult: null,
            glareResult: null,

        }
    }
    componentDidMount = () => {
        const ratio = window.innerWidth  / window.innerHeight
        this.setState({ cameraRatio: ratio })
        this.onSetMessage()
    }
    onSetMessage = () => {
        this.setState({ POAMessage: t('poaDocumentCamera.message') })
    }
    onCapture = () => {
        const imageSrc = this.webcamRef.current.takePhoto()
        this.setState({ capturedImageSrc: imageSrc })
        console.log(imageSrc)
        this.setState({ previewImageStatuse: true })
        this.setState({ POAMessage: t('poaDocumentCamera.previewMessage') })
    }
    onReTake = () => {
        this.setState({ previewImageStatuse: false })
        this.setState({ isErrorStatus: false })
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
            console.log("ddddlajldjl")
        }
        console.log(b)
        console.log(g)
    }
    render() {
        return (
            <div>
                <div className="POACamera-Container">
                    <Camera
                        ref={this.webcamRef}
                        aspectRatio={this.state.cameraRatio}
                        facingMode={"environment"} />
                </div>
                {this.state.previewImageStatuse && <div className="POAPreviewImage-container" style={{ height: window.innerHeight }}>
                    <img style={{ width: "100%", height: window.innerHeight }} id="poaimageID" src={this.state.capturedImageSrc} onLoad={() => this.onLoadedImage()} />
                </div>}
                <div className="POAMain-container" style={{ height: window.innerHeight }}>
                    <div className="POAMessageView" style={{ bottom: window.innerHeight * 0.45 }}>
                        <p>{this.state.POAMessage}</p>
                    </div>
                    {(this.state.isErrorStatus) && <div className="POACamErrorMessageView" style={{ bottom: window.innerHeight * 0.3 }}>
                        <div className="container">
                            <div className="errortitle">
                                <img src={this.state.errorSRC} />
                                <p>{t('errorMessageTitle')}</p>
                            </div>
                            <div className="errormessage">
                                {(!this.state.blurResult) && <p style={{ marginBottom: "3px" }}> {t('blurryErrorMes')} </p>}
                                {(!this.state.glareResult) && <p style={{ marginBottom: "3px" }}> {t('glareErrorMes')} </p>}
                            </div>
                        </div>
                    </div>}
                    {(!this.state.previewImageStatus) && <div className="POATakeButtonView" style={{ display: "flex", justifyContent: "center" }}>
                        <Button
                            label={t('poaDocumentCamera.takePictureButton')}
                            onClick={this.onCapture}
                        />
                    </div>}
                    {(this.state.previewImageStatuse) && <div className="POAPreviewButtonView" style={{ display: "flex", justifyContent: "center" }}>
                        <Button
                            label={t('poaDocumentCamera.retakeButton')}
                            onClick={this.onReTake}
                        />
                        {(!this.state.isErrorStatus) && <Button
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
export default withTranslation(POACamera);