import React, { Component, useState } from 'react';
import { withRouter } from "react-router";
import Header from "../../Components/whiteHeader/whiteHeader"
import IDDocButton from "../../Components/idDocButton/idDocButton"
import POADocURL from "../../assets/ic_addressproof_purple.png"
import dropURL from '../../assets/ic_drop.png'
import dateURL from '../../assets/ic_date.png'
import backbuttonURL from '../../assets/ic_back1.png'
import countryList from 'react-select-country-list'
import DatePicker from "react-datepicker";
import DocumentArray from '../../CommonData/DocumentTypeArray';
import Button from "../../Components/POAButton/POAButton"
import "react-datepicker/dist/react-datepicker.css";
import './POADoc.css';

import { setTranslations, setDefaultLanguage, setLanguage, withTranslation, t } from 'react-multi-lang'
let lan = localStorage.getItem('language');
setDefaultLanguage(lan)

class POADoc extends Component {
    constructor(props) {
        super(props);
        this.options = countryList().getData()
        this.state = {
            POADocSrc: POADocURL,
            sendHeaderText: t('poaDoc.title'),
            selectCountryStatus: false,
            options: this.options,
            value: null,
            nextUrl: '',
            startDate: new Date(),
            txtColor: "gray",
            dropSrc: dropURL,
            dateSrc: dateURL,
            onDocumentType: false,
            documentTypeArray: DocumentArray,
            setedDoc: "Electricity Billing",
            headerColor: "#7f00ff",
            headerTitleColor: "white",
            backButtonSrc: backbuttonURL,

        }
    }
    setStartDate(date) {
        this.setState({ startDate: date })
    }

    componentDidMount = () => {
        console.log("countries:", this.options)
    }
    onSelectDocumentType = () => {
        this.setState({ onDocumentType: true })
    }
    onSelectedDocument = (document) => {
        this.setState({ onDocumentType: false })
        console.log(document)
        this.setState({ setedDoc: document })
    }
    render() {
        const ExampleCustomInput = ({ value, onClick }) => (
            <div style={{ fontSize: "16px", display: "flex", alignItems: "center", color: this.state.txtColor }} className="example-custom-input" onClick={onClick}>
                {value}
                <img src={this.state.dateSrc} style={{ width: "20px", height: "20px", marginLeft: "16px" }} />
            </div>

        );
        return (
            <div style={{ background: this.state.txtColor }}>
                {(!this.state.selectCountryStatus) && !this.state.onDocumentType &&
                    <>
                        <Header headerText={this.state.sendHeaderText} headerBackgroundColor={this.state.headerColor} txtColor={this.state.headerTitleColor} />
                        <div className="idmain_body-container" style={{ alignItems: "center" }}>
                            <div className="POA-container">
                                <p style={{ paddingLeft: "16px", paddingRight: "16px", fontSize: "16px", color: this.state.txtColor }}>{t('poaDoc.message')}</p>
                            </div>
                            <div className="selectDocTitle" style={{ color: this.state.txtColor }}>{t('poaDoc.selectDocTitle')}</div>
                            <div className="selectTypeView" onClick={this.onSelectDocumentType}>
                                <p style={{ paddingLeft: "20px", marginBottom: "0px", fontSize: "16px", color: this.state.txtColor }}>{this.state.setedDoc}</p>
                                <img style={{ width: "15px", height: "10px", right: "25px", position: "absolute" }} src={this.state.dropSrc} />
                            </div>
                            <div style={{ width: "100%", height: "70px", display: "flex", alignItems: "center", position: "relative" }}>
                                <p className="issueDate" style={{ color: this.state.txtColor }}>{t('poaDoc.issueDate')}</p>
                            </div>
                            <div className="issuDateView" onClick={this.props.onClick}>
                                <DatePicker
                                    selected={this.state.startDate}
                                    onChange={date => this.setStartDate(date)}
                                    customInput={<ExampleCustomInput />}
                                />
                            </div>
                            <div style = {{width:"100%",paddingLeft:"15px",paddingRight:"15px"}}>
                                <Button
                                    label={t('poaDoc.scanPOAButton')}
                                    onClick={() => {
                                        // localStorage.setItem("poaDate",this.state.startDate)
                                        window.POADate = this.state.startDate
                                        this.props.history.push('poacamera')
                                    }}
                                />
                            </div>

                        </div>
                    </>}
                {this.state.onDocumentType && <div>
                    {/* <Header headerText="Select POA Document Type" headerBackgroundColor = {this.state.headerColor} txtColor={this.state.headerTitleColor} /> */}
                    <div className="POADocTypeTopBar" style={{ height: window.innerHeight * 0.07 }}>
                        <img src={this.state.backButtonSrc} onClick={() => {
                            this.setState({ onDocumentType: false })
                        }} className="POADocbtnBack" />
                        <p className="liveness_txtTitle" style={{ color: this.state.headerTitleColor }}>Select POA Document Type</p>
                        <div style={{ width: '10px' }}></div>
                    </div>
                    {
                        this.state.documentTypeArray.map((data, index) => {
                            return (
                                <div className="documentInclude" onClick={this.onSelectedDocument.bind(this, data.value)}>
                                    <div className="documentArrayText" style={{ color: this.state.txtColor }}>{data.value}</div>
                                </div>
                            )

                        })
                    }
                </div>}

            </div>
        )
    }
}

export default withTranslation(POADoc);