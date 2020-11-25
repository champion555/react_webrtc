import React, { Component, useState } from 'react';
import { withRouter } from "react-router";
import Header from "../../Components/header/header"
import IDDocButton from "../../Components/idDocButton/idDocButton"
import POADocURL from "../../assets/ic_addressproof_purple.png"
import countryList from 'react-select-country-list'
import DatePicker from "react-datepicker";
import Button from "../../Components/POAButton/POAButton"
import "react-datepicker/dist/react-datepicker.css";
import './POADoc.css';

class POADoc extends Component {
    constructor(props) {
        super(props);
        this.options = countryList().getData()
        this.state = {
            POADocSrc: POADocURL,
            sendHeaderText: 'POA Document',
            selectCountryStatus: false,
            options: this.options,
            value: null,
            nextUrl: '',
            startDate: new Date(),
        }
    }
    setStartDate(date) {
        this.setState({ startDate: date })
    }

    componentDidMount = () => {
        console.log("countries:", this.options)
    }
    render() {
        return (
            <div style={{ background: 'black' }}>
                {(!this.state.selectCountryStatus) &&
                    <>
                        <Header headerText={this.state.sendHeaderText} url="idmain" />
                        <div className="idmain_body-container">
                            <div className="mark-container">
                                <div className="markView">
                                    <img src={this.state.POADocSrc} className="identityIcon" />
                                </div>
                            </div>
                            <div className="issuDateView" onClick={this.props.onClick}>
                                <p style={{ marginLeft: "16px", fontSize: "18px", paddingRight: "30px" }}>Issue Date</p>
                                <DatePicker
                                    selected={this.state.startDate}
                                    onChange={date => this.setStartDate(date)}
                                    isClearable
                                    placeholderText="mm/dd/yyyy" />
                            </div>
                            <Button
                                label="Scan PoA Document"
                                onClick={() => {
                                    // localStorage.setItem("poaDate",this.state.startDate)
                                    window.POADate = this.state.startDate
                                    this.props.history.push('poadocumentcamera')
                                    
                                }}
                            // onClick={this.onSelectNextURL.bind(this, "POADoc")}
                            />
                        </div>

                    </>}
                {(this.state.selectCountryStatus) &&
                    <div style={{ background: 'white' }}>
                        <Header headerText="Select the country" />
                        <input type="text" placeholder="Search the country" style={{ width: '100%', height: '30px' }} onChange={this.onSearch} />
                        {this.state.options.map(CountryItem => {
                            let CountryFlag = "https://www.countryflags.io/" + CountryItem.value + "/flat/64.png";
                            return (
                                <div onClick={this.onSelectCountry.bind(this, CountryItem.label)} style={{ display: 'flex', float: 'left', width: '100%', boxShadow: '0 1px' }}>
                                    <img src={CountryFlag} />
                                    <span style={{ textAlign: 'center', marginTop: '20px', marginLeft: '10px' }}>{CountryItem.label}</span>
                                    <br />
                                    <br />
                                </div>
                            )
                        })}
                    </div>
                }

            </div>
        )
    }
}

export default withRouter(POADoc);