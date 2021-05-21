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
import { Modal } from 'react-responsive-modal';
import ContinueButton from "../../Components/POAButton/POAButton"
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
            clickFlag: 0,
            idCardFlag: false,
            passportFlag: false,
            residentFlag: false,
            modalCardType:null,
            // oldIDCardFlag:false,
            // oldResidentFlag:false,
            descriptionColor: "gray",
            headerColor: "#7f00ff",
            headerTitleColor: "white",
            background: "white",
            buttonBackgroundColor: "#7f00ff",
            buttonTitleColor: "white"
        }
    }

    componentDidMount = () => {
        this.setState({ headerColor: window.headerBackgroundColor })
        this.setState({ headerTitleColor: window.headerTextColor })
        this.setState({ background: window.pageBackgroundColor })
        this.setState({ descriptionColor: window.pageTextColor })
        this.setState({ buttonBackgroundColor: window.buttonBackgroundColor })
        this.setState({ buttonTitleColor: window.buttonTextColor })

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
                this.setState({ idCardFlag: true })
                // if (window.mrz == "OID") {                    
                //     this.setState({ oldIDCardFlag: true })
                // }else{

                // }
                break;
            case 'PARE':
                console.log("PARE_switch")
                this.setState({ passportFlag: true })
                this.setState({ residentFlag: true })
                // if (window.mrz == "ORE") {                    
                //     this.setState({ oldResidentFlag: true })
                // }else{

                // }
                break;
            case 'PAIDRE':
                this.setState({ passportFlag: true })
                this.setState({ idCardFlag: true })
                this.setState({ residentFlag: true })
                // if (window.mrz == "OID") {                    
                //     this.setState({ oldIDCardFlag: true })
                // }else if (window.mrz == "ORE") {                    
                //     this.setState({ oldResidentFlag: true })
                // }else if (window.mrz === "OIDORE") {
                //     this.setState({oldIDCardFlag:true})
                //     this.setState({oldResidentFlag:true})
                // }else{

                // }                

                console.log("PAIDRE_switch")
                break;
            default:

                break;
        }
    }
    onSelectNextURL = (link) => {
        // if (link === "idcard") {
        //     window.IDType = "idcard"
        // } else if (link === "passport") {
        //     window.IDType = "passport"
        // } else if (link === "resident") {
        //     window.IDType = "resident"
        // } else if (link === "newIDCard") {
        //     window.IDType = "idcard"
        // } else if (link === "oldIDCard") {
        //     window.IDType = "oldidcard"
        // } else if (link === "newResident") {
        //     window.IDType = "resident"
        // } else if (link === "oldResident") {
        //     window.IDType = "oldresident"
        // }
        if (link === "passport") {
            window.IDType = "passport"
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
    onOpenModal = (cardType) => {
        console.log("sadf")
        if(cardType === "idcard"){
            this.setState({modalCardType:"idCard"})
        }else if(cardType === "resident"){
            this.setState({modalCardType:"resident"})
        }
        this.setState({ modalOpen: true })
    }
    onFrontDocument = () => {
        this.setState({ modalOpen: false })
        if (this.state.modalCardType === "idCard"){
            window.IDType = "oldidcard"
        }else if( this.state.modalCardType === "resident"){
            window.IDType = "oldresident"
        }
        this.props.history.push('iddoccamera')
    }
    onBackDocument = () => {
        this.setState({ modalOpen: false })
        if (this.state.modalCardType === "idCard"){
            window.IDType = "idcard"
        }else if( this.state.modalCardType === "resident"){
            window.IDType = "resident"
        }
        this.props.history.push('iddoccamera')
    }
    render() {
        return (
            <div style={{ background: 'black' }}>
                {(!this.state.selectCountryStatus) &&
                    <>
                        <Header headerText={this.state.sendHeaderText} headerBackgroundColor={this.state.headerColor} txtColor={this.state.headerTitleColor} />
                        <div className="idmain_body-container" style={{ background: this.state.background }}>
                            <div className="mark-container" style={{ background: this.state.background }}>
                                <p style={{ fontSize: "18px", color: this.state.descriptionColor }}>{window.countryName}</p>
                                <p style={{ fontSize: "16px", paddingLeft: "10px", paddingRight: "10px", color: this.state.descriptionColor }}>{t('idMain.message')}</p>
                            </div>
                            {this.state.passportFlag && <IDDocButton
                                textColor={this.state.descriptionColor}
                                label={t('idMain.passportButton')}
                                imgURL={this.state.PassportSrc}
                                onClick={this.onSelectNextURL.bind(this, "passport")}
                                // onClick = {this.onOpenModal}
                            />}
                            {this.state.idCardFlag && <IDDocButton
                                textColor={this.state.descriptionColor}
                                label={t('idMain.idButton')}
                                imgURL={this.state.IDCardSrc}
                                // onClick={this.onSelectNextURL.bind(this, "idcard")}
                                onClick = {this.onOpenModal.bind(this,"idcard")}
                            />}
                            {/* {this.state.oldIDCardFlag && <div className="IDDocButton" >
                                <img src={this.state.IDCardSrc} className="imgIcon" />
                                <p className="NewIDDocButton" style = {{color:this.state.descriptionColor}} onClick={this.onSelectNextURL.bind(this, "newIDCard")}>{t('idMain.idButton')}</p>
                                <p className="OldIDButton" style = {{color:this.state.descriptionColor}} onClick={this.onSelectNextURL.bind(this, "oldIDCard")}>{t('idMain.OldButton')}</p>
                            </div>} */}
                            {this.state.residentFlag && <IDDocButton
                                textColor={this.state.descriptionColor}
                                label={t('idMain.residentButton')}
                                imgURL={this.state.ResidentSrc}
                                // onClick={this.onSelectNextURL.bind(this, "resident")}
                                onClick = {this.onOpenModal.bind(this,"resident")}
                            />}
                            {/* {this.state.oldResidentFlag && <div className="IDDocButton" >
                                <img src={this.state.ResidentSrc} className="imgIcon" />
                                <p className="NewIDDocButton" style = {{color:this.state.descriptionColor}} onClick={this.onSelectNextURL.bind(this, "newResident")}>{t('idMain.residentButton')}</p>
                                <p className="OldIDButton" style = {{color:this.state.descriptionColor}} onClick={this.onSelectNextURL.bind(this, "oldResident")}>{t('idMain.OldButton')}</p>
                            </div>} */}
                            <p style={{ width: "100%", textAlign: "center", color: this.state.descriptionColor, fontStyle: 'italic', position: "absolute", bottom: "15px" }}>Powerd by BIOMIID</p>
                        </div>

                    </>}
                <Modal open={this.state.modalOpen} showCloseIcon={false} center>
                    <div className="modalView" style={{ height: window.innerHeight * 0.3 }}>
                        <div>
                            <p style={{ color: window.pageTextColor, fontSize: "18px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px" }}>If your ID Document has MRZ in front, please click "FRONT" button, else "BACK" button.</p>
                        </div>
                        <div style={{ position: "absolute", bottom: "15px", width: "100%", display: "flex", alignItems: "center", flexDirection: "row" }}>

                            <div style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px" }}>
                                <ContinueButton
                                    backgroundColor={window.buttonBackgroundColor}
                                    buttonTextColor={window.buttonTextColor}
                                    label="FRONT"
                                    onClick={this.onFrontDocument} />
                            </div>
                            <div style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px" }}>
                                <ContinueButton
                                    backgroundColor={window.buttonBackgroundColor}
                                    buttonTextColor={window.buttonTextColor}
                                    label="BACK"
                                    onClick={this.onBackDocument} />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withTranslation(IDMain);