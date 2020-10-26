import React, { Component } from 'react';
import { withRouter } from "react-router";
import Header from "../../Components/header/header"
import IDDocButton from "../../Components/idDocButton/idDocButton"
import IDCardURL from "../../assets/ic_idcard_purple.png"
import PassportURL from "../../assets/ic_passport_purple.png"
import ResidentURL from "../../assets/ic_residence_purple.png"
import IdentityURL from "../../assets/ic_identity_purple.png"
import POADocURL from "../../assets/ic_addressproof_purple.png"
import countryList from 'react-select-country-list'

class POADoc extends Component {
    constructor(props) {
        super(props);
        this.options = countryList().getData()
        this.state = {
            POADocSrc:POADocURL,
            sendHeaderText: 'POA Document',
            selectCountryStatus: false,
            options: this.options,
            value: null,
            nextUrl: '',
        }
    }

    componentDidMount = () => {
        console.log("countries:", this.options)
    }
    onSelectNextURL = (link) => {
        this.setState({ selectCountryStatus: true })
        this.setState({ nextUrl: link })
    }
    onSelectCountry = (CountryName) => {
        this.props.history.push('poadoccam')
        window.countryName = CountryName
        
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
                        <Header headerText={this.state.sendHeaderText} url="idmain" />
                        <div className="idmain_body-container">
                            <div className="mark-container">
                                <div className="markView">
                                    <img src={this.state.POADocSrc} className="identityIcon" />
                                </div>
                            </div>
                            <IDDocButton
                                label="POA Document"
                                imgURL={this.state.POADocSrc}
                                onClick={this.onSelectNextURL.bind(this, "POADoc")}
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