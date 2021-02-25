import React, { Component } from 'react';
import { withRouter } from "react-router";
import Header from "../../Components/whiteHeader/whiteHeader"
import IDDocButton from "../../Components/idDocButton/idDocButton"
import IDCardURL from "../../assets/ic_idcard_purple1.png"
import PassportURL from "../../assets/ic_passport_purple1.png"
import ResidentURL from "../../assets/ic_residence_purple1.png"
import IdentityURL from "../../assets/ic_identity_purple.png"
import POADocURL from "../../assets/ic_addressproof_purple.png"
import countryList from 'react-select-country-list'
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'

import './IDMain.css';

let lan = localStorage.getItem('language');
setDefaultLanguage(lan)

class IDMain extends Component {
    constructor(props) {
        super(props);
        this.options = countryList().getData()
        this.state = {
            ImgSrc: IdentityURL,
            IDCardSrc: IDCardURL,
            PassportSrc: PassportURL,
            ResidentSrc: ResidentURL,
            POADocSrc: POADocURL,
            sendHeaderText: t('idMain.title'),
            value: null,
            descriptionColor: "gray",
            clickFlag: 0,
            idCardFlag: false,
            passportFlag: false,
            residentFlag: false,
            oldIDCardFlag:false,
            oldResidentFlag:false,
            headerColor: "#7f00ff",
            headerTitleColor: "white"
        }
    }

    componentDidMount = () => {
        console.log("countries:", this.options)
        console.log(window.countryName)
        console.log(window.surpportedDocType)
        console.log(window.mrz)
        switch (window.surpportedDocType) {
            case 'PA':
                console.log("PA_switch")
                this.setState({ passportFlag: true })
                break;
            case 'PAID':
                console.log("PAID_switch")
                this.setState({ passportFlag: true })
                if (window.mrz == "OID") {                    
                    this.setState({ oldIDCardFlag: true })
                }else{
                    this.setState({ idCardFlag: true })
                }

                break;
            case 'PARE':
                console.log("PARE_switch")
                this.setState({ passportFlag: true })
                if (window.mrz == "ORE") {                    
                    this.setState({ oldResidentFlag: true })
                }else{
                    this.setState({ residentFlag: true })
                }
                break;
            case 'PAIDRE':
                this.setState({ passportFlag: true })
                if (window.mrz == "OID") {                    
                    this.setState({ oldIDCardFlag: true })
                }else if (window.mrz == "ORE") {                    
                    this.setState({ oldResidentFlag: true })
                }else if (window.mrz === "OIDORE") {
                    this.setState({oldIDCardFlag:true})
                    this.setState({oldResidentFlag:true})
                }else{
                    this.setState({idCardFlag:true})
                    this.setState({residentFlag:true})
                }                
                
                console.log("PAIDRE_switch")
                break;
            default:

                break;
        }
    }
    onSelectNextURL = (link) => {
        if (link === "idcard") {
            window.IDType = "idcard"
        } else if (link === "passport") {
            window.IDType = "passport"
        } else if (link === "resident") {
            window.IDType = "resident"
        } else if (link === "newIDCard") {
            window.IDType = "idcard"
        } else if (link === "oldIDCard") {
            window.IDType = "oldidcard"
        } else if (link === "newResident") {
            window.IDType = "resident"
        } else if (link === "oldResident") {
            window.IDType = "oldresident"
        }
        this.props.history.push('iddoccamera')
    }
    onBlur = () => {

    }
    onSearch = (e) => {
        let searchWord = e.target.value;
        if (searchWord.length > 0) {
            let NewSearchUpperCase = e.target.value[0].toUpperCase() + e.target.value.slice(1, e.target.value.length)
            console.log("NewSearchUpperCase:", NewSearchUpperCase)
            let { options } = this.state;
            let NewSearchCountry = [];
            this.options.map((Country, key) => {
                let NewACountry = {};
                if (Country.label.includes(NewSearchUpperCase)) {
                    NewACountry.value = Country.value
                    NewACountry.label = Country.label
                    NewSearchCountry.push(NewACountry)
                }
            })
            options = NewSearchCountry;
            this.setState({ options })
        }
    }


    render() {
        return (
            <div style={{ background: 'black' }}>
                {(!this.state.selectCountryStatus) &&
                    <>
                        <Header headerText={this.state.sendHeaderText} headerBackgroundColor={this.state.headerColor} txtColor={this.state.headerTitleColor} />
                        <div className="idmain_body-container">
                            <div className="mark-container" style={{ background: "#fff" }}>
                                <p style={{ fontSize: "18px", color: this.state.descriptionColor }}>{window.countryName}</p>
                                <p style={{ fontSize: "16px", paddingLeft: "10px", paddingRight: "10px", color: this.state.descriptionColor }}>{t('idMain.message')}</p>
                            </div>
                            {this.state.passportFlag && <IDDocButton
                                label={t('idMain.passportButton')}
                                imgURL={this.state.PassportSrc}
                                onClick={this.onSelectNextURL.bind(this, "passport")}
                            />}
                            {this.state.idCardFlag && <IDDocButton
                                label={t('idMain.idButton')}
                                imgURL={this.state.IDCardSrc}
                                onClick={this.onSelectNextURL.bind(this, "idcard")}
                            />}
                            {this.state.oldIDCardFlag && <div className="IDDocButton" >
                                <img src={this.state.IDCardSrc} className="imgIcon" />
                                <p className="NewIDDocButton" onClick={this.onSelectNextURL.bind(this, "newIDCard")}>{t('idMain.idButton')}</p>
                                <p className="OldIDButton" onClick={this.onSelectNextURL.bind(this, "oldIDCard")}>{t('idMain.OldButton')}</p>
                            </div>}
                            {this.state.residentFlag && <IDDocButton
                                label={t('idMain.residentButton')}
                                imgURL={this.state.ResidentSrc}
                                onClick={this.onSelectNextURL.bind(this, "resident")}
                            />}
                            {this.state.oldResidentFlag && <div className="IDDocButton" >
                                <img src={this.state.ResidentSrc} className="imgIcon" />
                                <p className="NewIDDocButton" onClick={this.onSelectNextURL.bind(this, "newResident")}>{t('idMain.residentButton')}</p>
                                <p className="OldIDButton" onClick={this.onSelectNextURL.bind(this, "oldResident")}>{t('idMain.OldButton')}</p>
                            </div>}
                            <p style={{ width: "100%", textAlign: "center", color: this.state.descriptionColor, fontStyle: 'italic', position: "absolute", bottom: "15px" }}>Powerd by BIOMIID</p>
                        </div>

                    </>}
            </div>
        )
    }
}

export default withTranslation(IDMain);