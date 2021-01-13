import React, { Component } from 'react';
import { withRouter } from "react-router";
import ImageURL from "../../assets/ic_logo.png"
import CheckURL from "../../assets/ic_check_voilet.png"
import languageURL from '../../assets/ic_language_purple.png'
import { Dropdown } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import COUNTRY_OPTIONS from '../../CommonData/LanguageFlageList.js';
import { countries } from 'country-flag-icons'
import LanguageArray from '../../CommonData/LanguageArray';
import backImageURL from "../../assets/ic_back1.png"
import Header from '../../Components/whiteHeader/whiteHeader'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { setTranslations, setDefaultLanguage, setLanguage, withTranslation } from 'react-multi-lang'

import bz from '../../CommonData/LanguageTranslation/bz.json'
import de from '../../CommonData/LanguageTranslation/de.json'
import en from '../../CommonData/LanguageTranslation/en.json'
import es from '../../CommonData/LanguageTranslation/es.json'
import fr from '../../CommonData/LanguageTranslation/fr.json'
import id from '../../CommonData/LanguageTranslation/id.json'
import it from '../../CommonData/LanguageTranslation/it.json'
import ja from '../../CommonData/LanguageTranslation/ja.json'
import ko from '../../CommonData/LanguageTranslation/ko.json'
import nl from '../../CommonData/LanguageTranslation/nl.json'
import pl from '../../CommonData/LanguageTranslation/pl.json'
import pt from '../../CommonData/LanguageTranslation/pt.json'
import ro from '../../CommonData/LanguageTranslation/ro.json'
import ru from '../../CommonData/LanguageTranslation/ru.json'
import sv from '../../CommonData/LanguageTranslation/sv.json'
import th from '../../CommonData/LanguageTranslation/th.json'
import tr from '../../CommonData/LanguageTranslation/tr.json'
import uk from '../../CommonData/LanguageTranslation/uk.json'
import vi from '../../CommonData/LanguageTranslation/vi.json'
import zh from '../../CommonData/LanguageTranslation/zh.json'
import type { T } from 'react-multi-lan'
import './Home.css';

setTranslations({ bz, de, en, es, fr, id, it, ja, ko, nl, pl, pt, ro, ru, sv, th, tr, uk, vi, zh })
setDefaultLanguage("en")
type Props = {
    t: T
}



class Home extends React.Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            ImageSrcs: ImageURL,
            languageSrc: languageURL,
            sendHeaderText: 'Home',
            checkSrc: CheckURL,
            flag: false,
            value: null,
            headBackgroundColor: "white",
            descriptionColor: "gray",
            buttonColor: "#7f00ff",
            onSelectLanguage: false,
            countryLanguageArray: LanguageArray,
            topMargin: null,
            languageSet: "en",
            backImageSrc: backImageURL,
            modalOpen: false,
        }
    }
    componentDidMount = () => {
        console.log(window.innerHeight)
        setDefaultLanguage("en")
        if (window.innerHeight > 600) {
            console.log("big device")
            this.setState({ topMargin: "35px" })
        } else if (window.innerHeight < 600) {
            console.log("small device")
            this.setState({ topMargin: "15px" })
        }
        console.log("window function : ", window.console_hmj)
        console.log(window.location.href)
        var pieces = window.location.href.split("/");
        console.log(pieces)
        console.log("url_valuclient_id:", this.props.match.params.client_id)
        console.log("applicantId:", this.props.match.params.applicantId)
        console.log("checkId:", this.props.match.params.checkId)
        console.log("env:", this.props.match.params.env)
    }
    handleChange = (e, { value }) => this.setState({ value })
    
    onSelectCountry = (language) => {
        console.log(language)
        this.setState({ languageSet: language })
        setLanguage(language)
        this.onCloseModal()
    }
    onstart = () => {
        localStorage.setItem('language', this.state.languageSet);
        window.location.href = "photoliveness"
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
                {!this.state.onSelectLanguage && <div className="body-container">
                    <div style={{ background: this.state.headBackgroundColor }}>
                        <div className="logoView" style={{ height: window.innerHeight * 0.12, marginTop: window.innerHeight * 0.01, background: this.state.headBackgroundColor }}>
                            <img src={this.state.ImageSrcs} className="logoIcon" />
                            <div className="languageView" onClick={this.onOpenModal} style={{ cursor: 'pointer' }}>
                                <img src={this.state.languageSrc} style={{ width: "25px", height: "25px" }} />
                            </div>
                        </div>
                        <div className="header">
                            <div className="companyName" style={{ color: this.state.descriptionColor }}>Company Name</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", background: "white" }}>
                        <div className="content">
                            <div className="info">
                                <p className='heading' style={{ color: this.state.descriptionColor }}>{t('Home.title')}</p>
                                <p className="desc" style={{ color: this.state.descriptionColor }}>{t('Home.titleDes')}</p>
                                <p style={{ fontSize: "20px", color: this.state.descriptionColor, fontWeight: "400", textAlign: "center" }}>{t('Home.smallTitle')}</p>
                            </div>
                            <div className="personal_data_list">
                                <div className="personal_data">
                                    <div className="title_panel">
                                        <div className="number"><img src={this.state.checkSrc} style={{ width: "20px", height: "20px" }} /></div>
                                        <div className="title"><p style={{ color: this.state.descriptionColor }}>{t('Home.checkDes1')}</p></div>
                                    </div>
                                </div>
                                <div className="personal_data">
                                    <div className="title_panel">
                                        <div className="number"><img src={this.state.checkSrc} style={{ width: "20px", height: "20px" }} /></div>
                                        <div className="title"><p style={{ color: this.state.descriptionColor }}>{t('Home.checkDes2')}</p></div>
                                    </div>
                                </div>
                                <div className="personal_data">
                                    <div className="title_panel">
                                        <div className="number"><img src={this.state.checkSrc} style={{ width: "20px", height: "20px" }} /></div>
                                        <div className="title"><p style={{ color: this.state.descriptionColor }}>{t('Home.checkDes3')}</p></div>
                                    </div>
                                </div>
                                <div className='termsOfService' style={{ color: this.state.descriptionColor, marginTop: this.state.topMargin }}>
                                    {t('Home.policyDes1')} <strong>{t('Home.policyDes2')}</strong> {t('Home.policyDes3')} <a href="#" style={{ color: this.state.descriptionColor, fontStyle: "italic" }}><strong>{t('Home.TermsofServiceTitle')}</strong></a>{t('Home.policyDes5')}<a href="#" style={{ color: this.state.descriptionColor, fontStyle: "italic" }}><strong>{t('Home.privacyPolicyTitle')}</strong></a>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div style={{ width: "100%", flexDirection: "column", alignItems: "center", display: "flex", marginTop: this.state.topMargin }}>

                        <div className="startButton"
                            style={{ backgroundColor: this.state.buttonColor }}
                            onClick={this.onstart}>
                            <p style={{ marginBottom: "0px", marginTop: "0px" }}>{t('Home.startButtonTitle')}</p>
                        </div>
                        <div style={{ fontStyle: "italic", color: this.state.descriptionColor, marginTop: "10px" }}>Powerd by BIOMIID RapidCheck</div>
                    </div>
                </div>}
                <Modal open={this.state.modalOpen} showCloseIcon={false} center>
                    <div className="modalView" style={{ height: window.innerHeight*0.9, width:"100%"}}>
                        <div style = {{width:"100%"}}>
                            <div className="whiteHeaderView"  style = {{width:"100%"}}>
                                <img className="languagebtnBack" src={this.state.backImageSrc}
                                    onClick={() => {
                                        this.onCloseModal()
                                    }} />
                                <p className="whitetxtTitle" style={{ color: this.state.descriptionColor }}>Select the language</p>
                                <div style={{ width: '10px' }}></div>
                            </div>
                            {
                                this.state.countryLanguageArray.map((data, index) => {
                                    return (
                                        <div className="languageInclude" onClick={this.onSelectCountry.bind(this, data.key)} style = {{width:"100%"}}>
                                            <div className="languageArrayText" style={{ color: this.state.descriptionColor }} style = {{width:"100%"}}>{data.value}</div>
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

export default withTranslation(Home);
