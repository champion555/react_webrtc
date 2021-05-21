import React, { Component, useState } from 'react';
import { withRouter } from "react-router";
import Header from "../../Components/whiteHeader/whiteHeader"
import IDDocButton from "../../Components/idDocButton/idDocButton"
import POADocURL from "../../assets/ic_addressproof_purple.png"
import dropURL from '../../assets/ic_drop.png'
import dateURL from '../../assets/ic_date.png'
import backbuttonURL from '../../assets/ic_back1.png'
import searchImageURL from "../../assets/ic_search.png"
import countryList from 'react-select-country-list'
import DatePicker from "react-datepicker";
import DocumentArray from '../../CommonData/DocumentTypeArray';
import Button from "../../Components/POAButton/POAButton"
import LanguageArray from '../../CommonData/POALanguage';
import { Modal } from 'react-responsive-modal';
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
            background: "white",
            selectedLanguage:"France",
            modalOpen: false,
            backImageSrc:backbuttonURL,
            searchImageSrc:searchImageURL,
            countryArray: LanguageArray,
        }
    }
    setStartDate(date) {
        this.setState({ startDate: date })
        var selectedDate = date.toLocaleString().split(", ")
        console.log("date:", selectedDate[0])
        var subSt = selectedDate[0].split("/")
        console.log("selectedDate:", selectedDate[0])
        var month = subSt[0]
        var day = subSt[1]
        var year = subSt[2]
        var monthSt = ""
        var daySt = ""
        console.log("daycount:",day.length)
        if(day.length < 2){
            daySt = "0" + day
            console.log("dafdsfasd")
        }else{
            daySt = day
        }
        if (month.length <2) {
            monthSt = "0" + month
        }else{
            monthSt =  month
        }
        window.poaIssueDate = year + "/" + monthSt + "/" + daySt
        console.log("window.poaIssueDate:", window.poaIssueDate)
        

    }

    componentDidMount = () => {
        var date = { currentTime: new Date().toLocaleString() };
        console.log("date: ", date.currentTime)
        var currentDate = date.currentTime.split(", ");
        var subSt = currentDate[0].split("/")
        console.log("currentDate:", currentDate[0])
        var month = subSt[0]
        var day = subSt[1]
        var year = subSt[2]
        var monthSt = ""
        var daySt = ""
        console.log("daycount:",day.length)
        if(day.length < 2){
            daySt = "0" + day
            console.log("dafdsfasd")
        }else{
            daySt = day
        }
        if (month.length <2) {
            monthSt = "0" + month
        }else{
            monthSt =  month
        }
        window.poaIssueDate = year + "/" + monthSt + "/" + daySt
        console.log("window.poaIssueDate:", window.poaIssueDate)

        window.poaDocType = this.state.setedDoc
        this.setState({ headerColor: window.headerBackgroundColor })
        this.setState({ headerTitleColor: window.headerTextColor })
        this.setState({ background: window.pageBackgroundColor })
        this.setState({ txtColor: window.pageTextColor })
        this.setState({ buttonBackgroundColor: window.buttonBackgroundColor })
        this.setState({ buttonTitleColor: window.buttonTextColor })

        var country
        var getCountryName
        this.state.countryArray.map((data, index) => {
            if (data.name == window.countryName) {                
                window.POALanguage = data.code
                console.log("window.POALanguage:", window.POALanguage);
            }
        })
    }
    onSelectDocumentType = () => {
        this.setState({ onDocumentType: true })
    }
    onSelectLanguage = () => {
        console.log("selected language")
        this.setState({modalOpen:true})

    }
    // onSearch = (e) => {
    //     let searchWord = e.target.value;
    //     if (searchWord.length > 0) {
    //         let NewSearchUpperCase = e.target.value[0].toUpperCase() + e.target.value.slice(1, e.target.value.length)
    //         console.log("NewSearchUpperCase:", NewSearchUpperCase)
    //         let { countryArray } = this.state;
    //         let NewSearchCountry = [];
    //         LanguageArray.map((Country, key) => {
    //             let NewACountry = {};
    //             if (Country.name.includes(NewSearchUpperCase)) {
    //                 NewACountry.name = Country.name
    //                 NewACountry.code = Country.code
    //                 NewSearchCountry.push(NewACountry)
    //             }
    //         })
    //         countryArray = NewSearchCountry;
    //         this.setState({ countryArray })
    //     }
    // }
    // onSelectedCountryItem = (data) => {
    //     console.log(data.name)
    //     console.log(data.code)
    //     this.setState({ selectedLanguage: data.name })
    //     window.POALanguage = data.code
    //     this.onCloseModal()
    // }
    onSelectedDocument = (document) => {
        this.setState({ onDocumentType: false })
        console.log(document)
        this.setState({ setedDoc: document })
        window.poaDocType = document
    }
    // onOpenModal = () => {
    //     console.log("sadf")
    //     this.setState({ modalOpen: true })
    // }
    // onCloseModal = () => {
    //     this.setState({ modalOpen: false })
    // }
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
                        <div className="idmain_body-container" style={{ alignItems: "center", background: this.state.background }}>
                            <div className="POA-container">
                                <p style={{ paddingLeft: "16px", paddingRight: "16px", fontSize: "16px", color: this.state.txtColor }}>{t('poaDoc.message')}</p>
                            </div>
                            <div className="selectDocTitle" style={{ color: this.state.txtColor }}>{t('poaDoc.selectDocTitle')}</div>
                            <div className="selectTypeView" onClick={this.onSelectDocumentType}>
                                <p style={{ paddingLeft: "20px", marginBottom: "0px", fontSize: "16px", color: this.state.txtColor }}>{this.state.setedDoc}</p>
                                <img style={{ width: "15px", height: "10px", right: "25px", position: "absolute" }} src={this.state.dropSrc} />
                            </div>
                            {/* <div className="selectDocTitle" style={{ color: this.state.txtColor, marginTop:"10px" }}>{t('poaDoc.selectLanguageTitle')}</div>
                            <div className="selectPOALanguageView" onClick={this.onOpenModal}>
                                <p style={{ paddingLeft: "20px", marginBottom: "0px", fontSize: "16px", color: this.state.txtColor }}>{this.state.selectedLanguage}</p>
                                <img style={{ width: "15px", height: "10px", right: "25px", position: "absolute" }} src={this.state.dropSrc} />
                            </div> */}
                            <div style={{ width: "100%", height: "70px", display: "flex", alignItems: "center", position: "relative" }}>
                                <p className="issueDate" style={{ color: this.state.txtColor }}>{t('poaDoc.issueDate')}</p>
                            </div>
                            <div className="issuDateView" onClick={this.props.onClick}>
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={this.state.startDate}
                                    onChange={date => this.setStartDate(date)}
                                    customInput={<ExampleCustomInput />}
                                />
                            </div>
                            <div style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px" }}>
                                <Button
                                    backgroundColor={this.state.buttonBackgroundColor}
                                    buttonTextColor={this.state.buttonTitleColor}
                                    label={t('poaDoc.scanPOAButton')}
                                    onClick={() => {
                                        this.props.history.push('poaverihelp')
                                        // console.log("issusingDate:", window.poaIssueDate)
                                    }}
                                />
                            </div>
                            {/* <p>{this.state.issusingDate}</p> */}

                        </div>
                    </>}
                {this.state.onDocumentType && <div>
                    {/* <Header headerText="Select POA Document Type" headerBackgroundColor = {this.state.headerColor} txtColor={this.state.headerTitleColor} /> */}
                    <div className="POADocTypeTopBar" style={{ height: window.innerHeight * 0.07, background: this.state.headerColor }}>
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
                {/* <Modal open={this.state.modalOpen} showCloseIcon={false} center>
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
                                                    <div className="countryArrayText" style={{ color: this.state.titleColor }} >{data.name}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal> */}

            </div>
        )
    }
}

export default withTranslation(POADoc);