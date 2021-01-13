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
            idCardFlag : false,
            passportFlag : false,
            residentFlag : false
        }
    }

    componentDidMount = () => {
        console.log("countries:", this.options)
        console.log(window.countryName)
        console.log(window.surpportedDocType)
        switch (window.surpportedDocType) {
            case 'PA':
                console.log("PA_switch")
                this.setState({passportFlag:true})
                break;
            case 'ID':
                console.log("ID_switch")
                this.setState({idCardFlag:true})
                break;
            case 'RE':
                console.log("RE_switch")
                this.setState({residentFlag:true})
                break;
            case 'PAID':
                console.log("PAID_switch")
                this.setState({passportFlag:true})
                this.setState({idCardFlag:true})
                break;
            case 'PARE':
                console.log("PARE_switch")
                this.setState({passportFlag:true})
                this.setState({residentFlag:true})
                break;
            case 'IDRE':
                this.setState({idCardFlag:true})
                this.setState({residentFlag:true})
                console.log("IDRE_switch")
                break;
            case 'PAIDRE':
                this.setState({passportFlag:true})                
                this.setState({idCardFlag:true})
                this.setState({residentFlag:true})
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
        }
        this.props.history.push('iddocumentcamera')
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
                        <Header headerText={this.state.sendHeaderText} txtColor={this.state.descriptionColor} />
                        <div className="idmain_body-container">
                            <div className="mark-container" style={{ background: "#fff" }}>
                                <p style={{ fontSize: "18px", color: this.state.descriptionColor }}>{window.countryName}</p>
                                <p style={{ fontSize: "18px", paddingLeft: "10px", paddingRight: "10px", color: this.state.descriptionColor }}>{t('idMain.message')}</p>
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
                            
                            {this.state.residentFlag && <IDDocButton
                                label={t('idMain.residentButton')}
                                imgURL={this.state.ResidentSrc}
                                onClick={this.onSelectNextURL.bind(this, "resident")}
                            />}
                            <p style={{ width: "100%", textAlign: "center", color: this.state.descriptionColor, fontStyle: 'italic', position: "absolute", bottom: "15px" }}>Powerd by BIOMIID RapidCheck</p>
                        </div>

                    </>}
            </div>
        )
    }
}

export default withTranslation(IDMain);