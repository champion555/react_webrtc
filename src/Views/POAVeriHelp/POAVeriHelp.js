import React, { Component } from 'react';
import Header from '../../Components/whiteHeader/whiteHeader'
import SuccessURL from "../../assets/ic_success.png"
import FailedURL from "../../assets/ic_failed.png"
import imgURL from "../../assets/ic_poa_help.png"
import Button from "../../Components/POAButton/POAButton"
import WarringImgURL from "../../assets/ic_warring.png"
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'

import './POAVeriHelp.css'

let lan = localStorage.getItem('language');
setDefaultLanguage(lan)

class POAVeriHelp extends React.Component<Props> {
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
        this.setState({ headerColor: window.headerBackgroundColor })
        this.setState({ headerTitleColor: window.headerTextColor })
        this.setState({ txtColor: window.pageTextColor})
        if (window.innerHeight > 600) {
            this.setState({bottomMargin:"50px"})
            this.setState({imageHeight:window.innerHeight*0.4})

        } else {
            this.setState({bottomMargin:"25px"})
            this.setState({imageHeight:window.innerHeight*0.3})
        }
    }
    onContinue = () => {
        this.props.history.push('poacamera')
    }

    render() {

        return (
            <div className="poaHelp_Container" style={{ height: window.innerHeight }}>
                <Header headerText={t('poaDocHelp.headerTitle')} headerBackgroundColor={this.state.headerColor} url="photolivness" txtColor={window.headerTextColor} />
                <div className="main_Container" style={{ marginTop: window.innerHeight * 0.05 }}>
                    <p style = {{color: window.pageTextColor,width:"100%"}}>{t('poaDocHelp.title')}</p>
                    <img src={this.state.imgSrc} alt="POA help image" style={{ width: "70%", height: this.state.imageHeight }} />
                </div>
                <div className="poaHelp_message">
                    <img src={this.state.warringSrc} style={{ width: "20px", height: "20px" }} />
                    <p style={{ color: window.pageTextColor }}>{t('poaDocHelp.message')}</p>
                </div>
                <div className="buttonView" style = {{bottom:this.state.bottomMargin}}>
                    <Button
                        backgroundColor={window.buttonBackgroundColor}
                        buttonTextColor={window.buttonTextColor}
                        label={t('poaDocHelp.buttonTitle')}
                        onClick={() => this.onContinue()} />
                </div>
                <p className="footerTitle" style={{ color: this.state.txtColor }}>Powerd by BIOMIID</p>
            </div>
        )
    }
}
export default withTranslation(POAVeriHelp);