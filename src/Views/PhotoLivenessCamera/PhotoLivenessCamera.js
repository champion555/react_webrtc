import React, { Component, createRef } from 'react';
import { withRouter } from "react-router";
import captureImg from "../../assets/camera_take.png"
import UndetectImgURL from "../../assets/ic_undetected2.png"
import DetectImgURL from "../../assets/ic_detected2.png"
import { Camera } from "react-camera-pro";
import Button from "../../Components/POAButton/POAButton"
import BackURL from "../../assets/ic_cancel_white.png"
import WarringImgURL from "../../assets/ic_error.png"
import ReactCrop from "react-image-crop";
import ExitButton from '../../Components/button/button'
import ContinueButton from "../../Components/POAButton/POAButton"
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { PhotoUpload } from '../../lib/AppUtils';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './PhotoLivenessCamera.css'
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'
let lan = localStorage.getItem('language');
setDefaultLanguage(lan)

var openWindow;

class PhotoLivenessCamera extends Component {
    constructor(props) {
        super(props);
        this.webcamRef = React.createRef();
        this.state = {
            cameraRatio: null,
            croppedImageUrl: null,
            ImgSrc: DetectImgURL,
            screenshot: null,
            apiFlage: false,
            backButtonSrc: BackURL,
            titleColor: "white",
            backgroundColor:"#525151",
            modalOpen: false,
            crop: {
                unit: '%',
                x: 5,
                y: 5,
                width: 90,
                height: 75,
                aspect: 16 / 9
            },
            ovalFramHeight: null,
            messageFrameHeight: null,
            warringSrc: WarringImgURL,
        }
    }
    componentDidMount = () => {
        const ratio = window.innerWidth / window.innerHeight
        this.setState({ cameraRatio: ratio })
        if (window.innerHeight > 600){
            this.setState({ovalFramHeight:window.innerHeight * 0.731})
            this.setState({messageFrameHeight:window.innerHeight * 0.2})
        }else {
            this.setState({ovalFramHeight:window.innerHeight * 0.631})
            this.setState({messageFrameHeight:window.innerHeight * 0.3})
        }

    }
    onCapture = () => {
        const imageSrc = this.webcamRef.current.takePhoto()
        this.setState({ screenshot: imageSrc })
        this.setState({ apiFlage: true })
        PhotoUpload(imageSrc, (total, progress) => {
        }).then(res => {
            this.setState({ apiFlage: false })
            var response = res.data;
            console.log(response.score)
            console.log(response.result)
            // alert(response.score)
            // alert(response.result)
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
    }
    onImageLoaded = (image) => {
        this.imageRef = image;
    };
    onCropComplete = (crop) => {
        this.makeClientCrop(crop);
    };
    onCropChange = (crop, percentCrop) => {
        this.setState({ crop });
    };
    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                "newFile.jpeg"
            );
            this.setState({ croppedImageUrl: croppedImageUrl });
            window.photoLivenessSrc = croppedImageUrl
        }
    }
    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error("Canvas is empty");
                    return;
                }
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, "image/jpeg");
        });
    }
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
        return (
            <div>
                {/* <div style={{ position: "absolute", zIndex: "100", top: "0px" }}>
                    <img id="imageID" src={this.state.croppedImageUrl} />
                    <canvas id="myCanvas" />
                </div> */}
                <div className="POACamera-Container">
                    <Camera
                        ref={this.webcamRef}
                        aspectRatio={this.state.cameraRatio}
                        facingMode={"user"} />
                </div>
                <div className="PhotoLivnessCrop-container" style={{ height: window.innerHeight }}>
                    <ReactCrop
                        src={this.state.screenshot}
                        crop={this.state.crop}
                        ruleOfThirds
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onCropComplete}
                        onChange={this.onCropChange}
                    />
                </div>
                <div className="PhotoLivnessCamera-container" style={{ height: window.innerHeight }}>
                    <div className="LivenessTopBar" style={{ height: window.innerHeight * 0.07,opacity:"0.9",background:this.state.backgroundColor }}>
                        <img src={this.state.backButtonSrc} onClick={this.onOpenModal} className="photoLivenessbtnBack" />
                        <p className="liveness_txtTitle" style={{ color: this.state.titleColor }}>{t('PhotoLivness.title')}</p>
                        <div style={{ width: '10px' }}></div>
                    </div>
                    <div style={{ width: "100%", height: this.state.ovalFramHeight, backgroundImage: `url(${this.state.ImgSrc})`, backgroundSize: "100% 100%" }}></div>
                    <div className="liveness-captureButton" style={{ height: this.state.messageFrameHeight, background:this.state.backgroundColor, opacity:"0.9" }}>
                        {/* <p style={{ fontSize: "18px", color: this.state.titleColor, textAlign: "center", paddingLeft: "10px", paddingRight: "10px", position: "absolute", top: "5px" }}>{t('PhotoLivness.message')}</p> */}
                        <div style={{ width: "100%", display: "flex", flexDirection: "row", position: "absolute", top: "5px", paddingLeft: "15px", paddingRight: "15px", alignItems: "center" }}>
                            <img src={this.state.warringSrc} style={{ width: "20px", height: "20px" }} />
                            <p style={{ fontSize: "16px", color: this.state.titleColor, paddingLeft: "10px" }}>{t('PhotoLivness.message')}</p>
                        </div>
                        <div style={{ position: "absolute", bottom: "35px", width: '100%', display: "flex", justifyContent: "center",paddingLeft:"15px",paddingRight:"15px" }}>
                            <Button
                                label={t('PhotoLivness.takeCaptureButton')}
                                onClick={() => this.onCapture()}
                            />
                        </div>
                        <p style={{ color: this.state.titleColor, fontStyle: 'italic', position: "absolute", bottom: "5px" }}>Powerd by BIOMIID</p>
                    </div>
                </div>
                {(this.state.apiFlage) && <div className = "ResponseView" style={{ height: window.innerHeight, background: "#fff" }}>
                <p style={{ color: "#383838", fontStyle: 'italic', position: "absolute", bottom: "15px" }}>Powerd by BIOMIID</p>
                </div>}
                {(this.state.apiFlage) && <div className="loadingView" style={{ bottom: window.innerHeight * 0.5 }}>
                    <Loader
                        type="Oval"
                        color="#7f00ff"
                        height={80}
                        width={80}
                    />
                </div>}
                <Modal open={this.state.modalOpen} showCloseIcon={false} center>
                    <div className="modalView" style={{ height: window.innerHeight * 0.3 }}>
                        <div>
                            <p style={{ color: this.state.txtColor, fontSize: "18px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px" }}>Are you sure you want to exit the identification process?</p>
                        </div>
                        <div style={{ position: "absolute", bottom: "15px", width: "100%", display: "flex", alignItems: "center", flexDirection: "row" }}>
                            <div style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px" }}>
                                <ContinueButton
                                    label="YSE"
                                    onClick={this.onEXit} />
                            </div>
                            <div style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px" }}>
                                <ContinueButton
                                    label="NO"
                                    onClick={this.onCloseModal} />
                            </div>
                        </div>
                    </div>
                </Modal>

            </div>
        )
    }
}
export default withTranslation(PhotoLivenessCamera);