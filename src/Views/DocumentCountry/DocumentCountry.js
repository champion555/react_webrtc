import React, { Component } from 'react';
import { withRouter } from "react-router";
import Header from '../../Components/whiteHeader/whiteHeader'
import DropIconURL from '../../assets/ic_drop.png'
import Button from '../../Components/POAButton/POAButton'
import CountryArray from '../../CommonData/CountriesList';
import backImageURL from "../../assets/ic_back1.png"
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'

import './DocumentCountry.css';

let lan = localStorage.getItem('language');
setDefaultLanguage(lan)


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
        };
    }
    componentDidMount = () => {
        console.log(lan)

    }

    handleChange = (e, { value }) => this.setState({ value })

    onContinue = () => {
        window.countryName = this.state.countryName
        this.props.history.push('idmain')
    }
    onSelectedCountryItem = (country, docType) => {
        console.log("clicked language", country)
        console.log("countryDocType", docType)
        this.setState({ countryName: country })
        window.surpportedDocType = docType
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

    render() {
        const { t } = this.props
        return (
            <div>
                {!this.state.onSelectCountry && <div>
                    <Header headerText={t('documentCountry.title')} url="photolivness" txtColor={this.state.titleColor} />
                    <div className="documentContry_container" style={{ height: window.innerHeight - 50 }}>
                        <div className="documentContry_messageView" style={{ height: window.innerHeight * 0.15 }}>
                            <p style={{ position: "absolute", bottom: "0px", paddingLeft: "20px", paddingRight: "20px", fontSize: "18px", color: this.state.titleColor }}>{t('documentCountry.message')}</p>
                        </div>
                        <div style={{ width: "100%", height: window.innerHeight * 0.2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div className="selectDrop" onClick={this.onOpenModal}>
                                <div style={{ display: "flex", alignItems: "center", fontSize: "18px", paddingLeft: "16px", color: this.state.titleColor }}>{this.state.countryName}</div>
                                <div className="dropIconView">
                                    <img style={{ width: "15px", height: "10px" }} src={this.state.dropSrc} />
                                </div>

                            </div>
                        </div>
                        <div style={{ width: "100%", height: window.innerHeight * 0.4, position: "absolute", bottom: "0px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Button
                                label={t('documentCountry.continueButton')}
                                onClick={() => this.onContinue()} />
                            <p style={{ color: this.state.titleColor, fontStyle: 'italic', position: "absolute", bottom: "15px" }}>Powerd by BIOMIID RapidCheck</p>

                        </div>
                    </div>
                </div>}
                <Modal open={this.state.modalOpen} showCloseIcon={false} center>
                    <div className="modalView" style={{ height: window.innerHeight * 0.9, width: "100%" }}>
                        <div style = {{width:"100%"}}>
                            <div className="whiteHeaderView">
                                <img className="languagebtnBack" src={this.state.backImageSrc}
                                    onClick={() => {
                                        this.onCloseModal()
                                    }} />
                                <p className="whitetxtTitle" style={{ color: this.state.titleColor }}>Issuing Country</p>
                                <div style={{ width: '10px' }}></div>
                            </div>
                            {/* <input id="search-text" type="text" placeholder="Search the country" style={{ width: '100%', height: '30px' }} onChange={this.onSearch} /> */}
                            {
                                this.state.countryArray.map((data, index) => {
                                    return (
                                        <div className="languageInclude" onClick={this.onSelectedCountryItem.bind(this, data.country, data.docType)}>
                                            <div className="languageArrayText" style={{ color: this.state.titleColor }} >{data.country}</div>
                                        </div>
                                    )

                                })
                            }
                        </div>
                    </div>
                </Modal>

            </div>
        )
    }
}

export default withTranslation(DocumentCountry);
