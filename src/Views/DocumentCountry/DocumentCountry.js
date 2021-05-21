import React, { Component } from 'react';
import { withRouter } from "react-router";
import Header from '../../Components/whiteHeader/whiteHeader'
import DropIconURL from '../../assets/ic_drop.png'
import Button from '../../Components/POAButton/POAButton'
import CountryArray from '../../CommonData/CountriesList';
import backImageURL from "../../assets/ic_back1.png"
import searchImageURL from "../../assets/ic_search.png"
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'
import './DocumentCountry.css';

let lan = localStorage.getItem('language');
setDefaultLanguage(lan)
let api = "https://fcc-weather-api.glitch.me/api/current?";


class DocumentCountry extends React.Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            dropSrc: DropIconURL,
            titleColor: "gray",
            value: null,
            defaultValue: "France",
            countryArray: CountryArray,
            countryName: "France",
            backImageSrc: backImageURL,
            searchImageSrc: searchImageURL,
            headerColor: "#7f00ff",
            headerTitlecolor: "white",
            background: "white",
            buttonBackgroundColor: "#7f00ff",
            buttonTitleColor: "white",
            alertMessage: "",
            alertOpen: false,
            modalOpen: false
        };
    }
    componentDidMount = () => {
        this.setState({ headerColor: window.headerBackgroundColor })
        this.setState({ headerTitleColor: window.headerTextColor })
        this.setState({ background: window.pageBackgroundColor })
        this.setState({ titleColor: window.pageTextColor })
        this.setState({ buttonBackgroundColor: window.buttonBackgroundColor })
        this.setState({ buttonTitleColor: window.buttonTextColor })

        console.log(lan)
        var country
        var getCountryName
        this.state.countryArray.map((data, index) => {
            if (data.country == this.state.countryName) {
                console.log("counbtryJSON:", data);
                window.surpportedDocType = data.docType
                window.countryCode = data.countryCode
                window.mrz = data.mrz
            }
        })
    }

    handleChange = (e, { value }) => this.setState({ value })

    onContinue = () => {
        if (this.state.countryName == "") {
            this.setState({ alertMessage: "Please select the issusing country" })
            this.setState({ alertOpen: true })
        } else {
            window.countryName = this.state.countryName
            this.props.history.push('idmain')
        }
    }
    onSelectedCountryItem = (data) => {
        console.log(data.country)
        console.log(data.docType)
        console.log(data.PA_PREFIX)
        console.log(data.ID_PREFIX)
        console.log(data.RE_PREFIX)
        console.log(data.mrz)
        this.setState({ countryName: data.country })
        window.surpportedDocType = data.docType
        window.countryCode = data.countryCode
        window.mrz = data.mrz
        this.onCloseModal()
    }
    onSearch = (e) => {
        let searchWord = e.target.value;
        if (searchWord.length > 0) {
            let NewSearchUpperCase = e.target.value[0].toUpperCase() + e.target.value.slice(1, e.target.value.length)
            console.log("NewSearchUpperCase:", NewSearchUpperCase)
            let { countryArray } = this.state;
            let NewSearchCountry = [];
            CountryArray.map((Country, key) => {
                let NewACountry = {};
                if (Country.country.includes(NewSearchUpperCase)) {
                    NewACountry.countryCode = Country.countryCode
                    NewACountry.country = Country.country
                    NewACountry.region = Country.region
                    NewACountry.docType = Country.docType
                    NewACountry.PA_PREFIX = Country.PA_PREFIX
                    NewACountry.ID_PREFIX = Country.ID_PREFIX
                    NewACountry.RE_PREFIX = Country.RE_PREFIX
                    NewACountry.mrz = Country.mrz
                    NewSearchCountry.push(NewACountry)
                }
            })
            countryArray = NewSearchCountry;
            this.setState({ countryArray })
        }
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
    onCloseAlert = () => {
        this.setState({ alertOpen: false })
    }

    render() {
        const { t } = this.props
        return (
            <div>
                {!this.state.onSelectCountry && <div>
                    <Header headerText={t('documentCountry.title')} headerBackgroundColor={window.headerBackgroundColor} url="photolivness" txtColor={window.headerTextColor} />
                    <div className="documentContry_container" style={{ height: window.innerHeight - 50, background: this.state.background }}>
                        <div className="documentContry_messageView" style={{ height: window.innerHeight * 0.15 }}>
                            <p style={{ position: "absolute", bottom: "0px", paddingLeft: "15px", paddingRight: "15px", fontSize: "16px", color: this.state.titleColor }}>{t('documentCountry.message')}</p>
                        </div>
                        <div style={{ width: "100%", height: window.innerHeight * 0.2, display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "15px", paddingRight: "15px" }}>
                            <div className="selectDrop" onClick={this.onOpenModal}>
                                <div style={{ display: "flex", alignItems: "center", fontSize: "18px", paddingLeft: "16px", color: this.state.titleColor }}>{this.state.countryName}</div>
                                <div className="dropIconView">
                                    <img style={{ width: "15px", height: "10px" }} src={this.state.dropSrc} />
                                </div>

                            </div>
                        </div>
                        <div className="documentCountry_ButtonView" style={{ height: window.innerHeight * 0.4 }}>
                            <Button
                                backgroundColor={window.buttonBackgroundColor}
                                buttonTextColor={window.buttonTextColor}
                                label={t('documentCountry.continueButton')}
                                onClick={() => this.onContinue()} />
                            <p style={{ color: this.state.titleColor, fontStyle: 'italic', position: "absolute", bottom: "15px" }}>Powerd by BIOMIID</p>

                        </div>
                    </div>
                </div>}
                <Modal open={this.state.modalOpen} showCloseIcon={false} center>
                    <div className="modalView" style={{ height: window.innerHeight * 0.9, width: "100%", background: this.state.background }}>
                        <div style={{ width: "100%" }}>
                            <div className="whiteHeaderView" style={{ background: window.headerBackgroundColor }}>
                                <img className="countrybtnBack" src={this.state.backImageSrc}
                                    onClick={() => {
                                        this.onCloseModal()
                                    }} />
                                <p className="whitetxtTitle" style={{ color:window.headerTextColor }}>Issuing Country</p>
                                <div style={{ width: '10px' }}></div>
                            </div>
                            <div className="countryArray_Container">
                                <div className="searchContainer" style={{ background: this.state.background }}>
                                    <input id="search-text" type="text" placeholder="Document Country..." onChange={this.onSearch} />
                                    <img src={this.state.searchImageSrc} />
                                </div>
                                <div className="container" >
                                    {
                                        this.state.countryArray.map((data, index) => {
                                            return (
                                                <div className="countryInclude" onClick={this.onSelectedCountryItem.bind(this, data)}>
                                                    <div className="countryArrayText" style={{ color: this.state.titleColor }} >{data.country}</div>
                                                </div>
                                            )

                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

                <Modal open={this.state.alertOpen} showCloseIcon={false} center>
                    <div className="alertView" style={{ height: window.innerHeight * 0.2 }}>
                        <p>{this.state.alertMessage}</p>
                        <div className="alert_button" onClick={this.onCloseAlert}> OK </div>
                    </div>
                </Modal>

            </div>
        )
    }
}

export default withTranslation(DocumentCountry);
