import React, { Component } from 'react';
import Header from '../../Components/whiteHeader/whiteHeader'
import SuccessURL from "../../assets/ic_success.png"
import FailedURL from "../../assets/ic_failed.png"
import imgURL from "../../assets/ic_faceliveness_help.png"
import Button from "../../Components/POAButton/POAButton"
import WarringImgURL from "../../assets/ic_warring.png"
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'
import './LivenessHelp.css'

let lan = localStorage.getItem('language');
setDefaultLanguage(lan)

class LivenessHelp extends React.Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            txtColor: "gray",
            imgSrc: imgURL,
            headerColor: "#7f00ff",
            headerTitlecolor: "white",
            warringSrc:WarringImgURL,
            bottomMargin:"50px",
            imageHeight:window.innerHeight*0.4
        }
    }
    componentDidMount() {
        this.setState({ txtColor: window.pageTextColor })
        this.setState({ headerColor: window.headerBackgroundColor })
        this.setState({ headerTitleColor: window.headerTextColor })
        if (window.innerHeight > 600) {
            this.setState({bottomMargin:"30px"})
            this.setState({imageHeight:window.innerHeight*0.4})

        } else {
            this.setState({bottomMargin:"25px"})
            this.setState({imageHeight:window.innerHeight*0.3})
        }
    }
    onContinue = () => {
        console.log("the continue button clicked")
        this.props.history.push('photoliveness')
    }

    render() {
        return (
            <div className="livenessHelp_Container" style={{ height: window.innerHeight }}>
                <Header headerText={t('LivenessHelp.headerTitle')} headerBackgroundColor={this.state.headerColor} url="photolivness" txtColor={window.headerTextColor} />
                <div className="main_Container" style={{ marginTop: window.innerHeight * 0.05 }}>
                    <p style = {{color: window.pageTextColor}}>{t('LivenessHelp.title')}</p>
                    <img src={this.state.imgSrc} alt="Liveness help image" style={{ width: "60%", height:this.state.imageHeight}} />
                </div>
                <div className="liveness_message">
                    <img src={this.state.warringSrc} style={{ width: "20px", height: "20px" }} />
                    <p style={{color: window.pageTextColor}}>{t('LivenessHelp.message')}</p>
                </div>
                <div className="buttonView" style = {{bottom: this.state.bottomMargin}}>
                    <Button
                        backgroundColor={window.buttonBackgroundColor}
                        buttonTextColor={window.buttonTextColor}
                        label={t('LivenessHelp.buttonTitle')}
                        onClick={() => this.onContinue()} />
                </div>
                <p className="footerTitle" style={{ color: this.state.txtColor }}>Powerd by BIOMIID</p>
            </div>
        )
    }
}
export default withTranslation(LivenessHelp);