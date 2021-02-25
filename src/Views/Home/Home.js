import React, { Component } from 'react';
import { withRouter } from "react-router";
import ImageURL from "../../assets/ic_logo.png"
import lightURL from "../../assets/ic_light.png"
import CheckURL1 from "../../assets/ic_description1.png"
import CheckURL2 from "../../assets/ic_description2.png"
import CheckURL3 from "../../assets/ic_description3.png"
import ClockURL from '../../assets/ic_clock.png'
import languageURL from '../../assets/ic_language_purple.png'
import unselectURL from '../../assets/ic_unselect.png'
import selectURL from "../../assets/ic_select.png"
import 'semantic-ui-css/semantic.min.css';
import LanguageArray from '../../CommonData/LanguageArray';
import backImageURL from "../../assets/ic_back1.png"
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
            checkSrc1: CheckURL1,
            checkSrc2: CheckURL2,
            checkSrc3: CheckURL3,
            lightSrc: lightURL,
            clockSrc: ClockURL,
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
            selectedCountry: '',
            unselectSRC: unselectURL,
            selectSrc: selectURL,
            space: "15px"
        }
    }
    componentDidMount = () => {     
        console.log(process.env.REACT_APP_BASE_URL)          
        setDefaultLanguage("en")
        if (window.innerHeight > 600) {
            this.setState({ topMargin: "35px" })
        } else if (window.innerHeight < 600) {
            console.log("small device")
            this.setState({ topMargin: "15px" })
        }
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let clientId = params.get('clientId');
        let applicantId = params.get('applicantId');
        let checkId = params.get('checkId')
        let checkType = params.get('checkType')
        let env = params.get('env')
        console.log("clientId",clientId)
        console.log("applicantId",applicantId)
        console.log("checkId", checkId)
        console.log("checkType",checkType)
        console.log("env",env) 
        if (checkId === null || applicantId === null || checkId === null || checkType === null || env === null){
            console.log("null value detected")

        } else{
            console.log("API call in here")
            
        }    

    }
    handleChange = (e, { value }) => this.setState({ value })

    onSelectCountry = (language) => {
        console.log(language)
        this.setState({ languageSet: language })
        setLanguage(language)
        this.onCloseModal()
        this.setState({ selectedCountry: language })

    }
    onstart = () => {
        localStorage.setItem('language', this.state.languageSet);
        window.location.href = "photoliveness"
        // window.location.href = "photolivenesscamera"
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
                        <div className="logoView" style={{ marginTop: window.innerHeight * 0.03, background: this.state.headBackgroundColor }}>
                            <img src={this.state.ImageSrcs} className="logoIcon" />
                            <div className="languageView" onClick={this.onOpenModal} style={{ cursor: 'pointer' }}>
                                <img src={this.state.languageSrc} style={{ width: "45px", height: "45px" }} />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", background: "white" }}>
                        <div className="content">
                            <div className="info" style={{ paddingTop: "10px" }}>
                                <p className='heading' style={{ color: this.state.descriptionColor }}>{t('Home.title')}</p>
                                <div style={{ width: "100%", display: "flex", alignItems: "center", marginTop: "10px", paddingLeft: "15px", paddingRight: "15px" }}>
                                    <img src={this.state.clockSrc} style={{ width: "20px", height: "20px" }} />
                                    <p className="desc" style={{ color: this.state.descriptionColor, paddingLeft: "5px", paddingTop: "0px" }}>{t('Home.clockDes')}</p>
                                </div>
                                <p className="desc" style={{ color: this.state.descriptionColor }}>{t('Home.titleDes')}<strong>{t('Home.prodoctName')}</strong></p>
                                <div style={{ width: "100%", display: "flex", alignItems: "center", marginTop: "10px", paddingLeft: "15px", paddingRight: "15px" }}>
                                    <img src={this.state.lightSrc} style={{ width: "30px", height: "30px" }} />
                                    <p className="desc" style={{ color: this.state.buttonColor, paddingLeft: "5px", paddingTop: this.state.space }}>{t('Home.titleDes1')}</p>
                                </div>
                                <p style={{ fontSize: "16px", paddingTop: this.state.space, color: this.state.descriptionColor, fontWeight: "400", textAlign: "center" }}>{t('Home.smallTitle')}</p>
                                <p className="desc" style={{ color: this.state.descriptionColor, paddingTop: this.state.space }}>{t('Home.titleDes2')}</p>
                            </div>
                            <div className="personal_data_list">
                                <div className="personal_data">
                                    <div className="title_panel">
                                        <div className="number"><img src={this.state.checkSrc1} style={{ width: "20px", height: "20px" }} /></div>
                                        <div className="title"><p style={{ color: this.state.descriptionColor }}>{t('Home.checkDes1')}</p></div>
                                    </div>
                                </div>
                                <div className="personal_data">
                                    <div className="title_panel">
                                        <div className="number"><img src={this.state.checkSrc2} style={{ width: "20px", height: "20px" }} /></div>
                                        <div className="title"><p style={{ color: this.state.descriptionColor }}>{t('Home.checkDes2')}</p></div>
                                    </div>
                                </div>
                                <div className="personal_data">
                                    <div className="title_panel">
                                        <div className="number"><img src={this.state.checkSrc3} style={{ width: "20px", height: "20px" }} /></div>
                                        <div className="title"><p style={{ color: this.state.descriptionColor }}>{t('Home.checkDes3')}</p></div>
                                    </div>
                                </div>
                                <div className='termsOfService' style={{ color: this.state.descriptionColor, marginTop: this.state.topMargin }}>
                                    {t('Home.policyDes1')} <strong>{t('Home.policyDes2')}</strong> {t('Home.policyDes3')} <a href="#" style={{ color: this.state.descriptionColor, fontStyle: "italic" }}><strong><u>{t('Home.TermsofServiceTitle')}</u></strong></a>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div style={{ width: "100%", flexDirection: "column", alignItems: "center", display: "flex", paddingLeft: "15px", paddingRight: "15px" }}>
                        <div className="startButton"
                            style={{ backgroundColor: this.state.buttonColor }}
                            onClick={this.onstart}>
                            <p style={{ marginBottom: "0px", marginTop: "0px" }}>{t('Home.startButtonTitle')}</p>
                        </div>
                        <div style={{ fontStyle: "italic", color: this.state.descriptionColor, marginTop: "10px" }}>Powerd by BIOMIID</div>
                    </div>
                </div>}
                <Modal open={this.state.modalOpen} showCloseIcon={false} center>
                    <div className="modalView" style={{ height: window.innerHeight * 0.95, width: "100%" }}>
                        <div style={{ width: "100%" }}>
                            <div className="whiteHeaderView" style={{ width: "100%", background: "#7f00ff" }}>
                                <img className="languagebtnBack" src={this.state.backImageSrc}
                                    onClick={() => {
                                        this.onCloseModal()
                                    }} />
                                <p className="whitetxtTitle" style={{ color: "#fff" }}>Select the language</p>
                                <div style={{ width: '10px' }}></div>
                            </div>
                            {
                                this.state.countryLanguageArray.map((data, index) => {
                                    if (this.state.selectedCountry && this.state.selectedCountry == data.key) {
                                        return (
                                            <div className="languageInclude" onClick={this.onSelectCountry.bind(this, data.key)} style={{ width: "100%" }}>
                                                <div className="languageArrayText" style={{ width: "100%", color: '#7f00ff' }} >
                                                    <p>{data.value}</p>
                                                    <img src={this.state.selectSrc} />
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="languageInclude" onClick={this.onSelectCountry.bind(this, data.key)} style={{ width: "100%" }}>
                                                <div className="languageArrayText" style={{ width: "100%", color: this.state.descriptionColor }}>
                                                    <p>{data.value}</p>
                                                    <img src={this.state.unselectSRC} />
                                                </div>
                                            </div>
                                        )
                                    }

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
