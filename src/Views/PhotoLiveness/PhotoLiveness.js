import React, { Component } from 'react';
import { withRouter } from "react-router";
import captureImg from "../../assets/camera_take.png"
import UndetectImgURL from "../../assets/ic_undetected2.png"
import DetectImgURL from "../../assets/ic_detected2.png"
import BackURL from "../../assets/ic_cancel.png"
import Button from "../../Components/POAButton/POAButton"
import ExitButton from '../../Components/button/button'
import ContinueButton from "../../Components/POAButton/POAButton"
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import LogoURL from "../../assets/ic_logo1.png"
import { PhotoUpload } from '../../lib/AppUtils';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './PhotoLiveness.css';
import Webcam from "react-webcam";
import { within } from '@testing-library/react';
import { setTranslations, setDefaultLanguage, setLanguage,withTranslation } from 'react-multi-lang'

let lan =   localStorage.getItem('language'); 
setDefaultLanguage(lan)

class PhotoLiveness extends Component {
    constructor(props) {
        super(props);
        this.state = {
            frameHeight: window.innerHeight,
            captureImgSrc: captureImg,
            ImageURL: null,
            ImgSrc: DetectImgURL,
            logoSrc: LogoURL,
            apiFlage: false,
            backButtonSrc: BackURL,
            screenshot: null,
            titleColor: "gray",
            modalOpen: false,
        };
    }
    componentDidMount = () => {
        console.log("dadfadfa")        
      console.log(lan) 
    }
    onCapture = () => {
        const imageSrc = this.webcam.getScreenshot();
        this.setState({ screenshot: imageSrc })

        this.setState({ apiFlage: true })
        PhotoUpload(imageSrc, (total, progress) => {
        }).then(res => {
            this.setState({ apiFlage: false })
            var response = res.data;
            // alert(response.score)
            if (response.result === "LIVENESS") {
                this.props.history.push('documentcountry')
            } else if (response.result === "SPOOF") {
                window.livenessResult = response.result
                this.setState({ ImgSrc: UndetectImgURL })
                this.props.history.push('livenessresult')
            } else {
                window.livenessResult = response.result
                this.setState({ ImgSrc: UndetectImgURL })
                this.props.history.push('livenessresult')
            }

        }).catch(e => {
            alert("the server is not working, Please try again.");
            this.setState({ apiFlage: false })
            this.setState({ ImgSrc: UndetectImgURL })
        })
    };
    setRef = webcam => {
        this.webcam = webcam;
    };
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
    render() {
        const {t} = this.props
        const videoConstraints = {
            facingMode: "user"
        };
        return (
            <div>
                <div className="LivenessCamera-Container">
                    <Webcam
                        audio={false}
                        mirrored={true}
                        ref={this.setRef}
                        screenshotFormat="image/jpeg"
                        imageSmoothing={true}
                        width={"100%"}
                        screenshotQuality={1.0}
                        videoConstraints={videoConstraints}
                        forceScreenshotSourceSize="flase"
                    />
                </div>
                <div style={{ position: "absolute", zIndex: "2", width: "100%", height: window.innerHeight }}>
                    <div className="LivenessTopBar" style={{ height: window.innerHeight * 0.07 }}>
                        <img src={this.state.backButtonSrc} onClick={this.onOpenModal} className="photoLivenessbtnBack" />
                        <p className="liveness_txtTitle" style={{ color: this.state.titleColor }}>{t('PhotoLivness.title')}</p>
                        <div style={{ width: '10px' }}></div>
                    </div>
                    <div style={{ width: "100%", height: window.innerHeight * 0.631, backgroundImage: `url(${this.state.ImgSrc})`, backgroundSize: "100% 100%" }}></div>
                    <div className="liveness-captureButton" style={{ height: window.innerHeight * 0.3 }}>
                        <p style={{ fontSize: "18px", color: this.state.titleColor, textAlign: "center", paddingLeft: "10px", paddingRight: "10px", position: "absolute", top: "5px" }}>{t('PhotoLivness.message')}</p>
                        <div style = {{position:"absolute",bottom:"35px",width:'100%',display:"flex",justifyContent:"center"}}>
                            <Button
                                label={t('PhotoLivness.takeCaptureButton')}
                                onClick={() => this.onCapture()}
                            />
                        </div>
                        <p style={{ color: this.state.titleColor, fontStyle: 'italic', position: "absolute", bottom: "5px" }}>Powerd by BIOMIID RapidCheck</p>
                    </div>

                </div>

                {(this.state.apiFlage) && <div style={{ width: "100%", height: window.innerHeight, zIndex: 20, background: "#fff", position: "absolute", textAlign: "center",justifyContent:"center",display:"flex" }}>
                <p style={{ color: "#383838", fontStyle: 'italic', position: "absolute", bottom: "15px" }}>Powerd by BIOMIID RapidCheck</p>
                </div>}
                {(this.state.apiFlage) && <div className="loadingView" style={{ bottom: window.innerHeight * 0.5 }}>
                    <Loader
                        type="Puff"
                        color="#7f00ff"
                        height={80}
                        width={80}
                    />
                </div>}
                <Modal open={this.state.modalOpen} showCloseIcon={false} center>
                    <div className="modalView" style={{ height: window.innerHeight * 0.5 }}>
                        <div style={{ borderBottom: "solid 1px", borderColor: this.state.txtColor,width:"100%" }}>
                            <h2 style={{ paddingLeft: "30px", paddingRight: "30px", paddingTop: "10px", paddingBottom: "10px", color: "gray" }}>Leaving so soon?</h2>
                        </div>
                        <div>
                            <p style={{ color: this.state.txtColor, fontSize: "18px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px" }}>Are you sure you want to exit the identification process?</p>
                        </div>
                        <div style={{ position: "absolute", bottom: "15px",width:"100%",display:"flex",alignItems:"center",flexDirection:"column"}}>
                            <ExitButton
                                label="EXIT"
                                onClick={this.onEXit} />
                            <ContinueButton
                                label="CONTIMUE"
                                onClick={this.onCloseModal} />
                        </div>


                    </div>

                </Modal>
            </div>
        )
    }
}

export default withTranslation (PhotoLiveness);
