import React, { Component } from 'react';
import Header from "../../Components/whiteHeader/whiteHeader"
import SuccessURL from "../../assets/ic_success.png"
import FailedURL from "../../assets/ic_failed.png"
import UnableURL from "../../assets/ic_unable.png"
import Button from "../../Components/POAButton/POAButton"
import { setTranslations, setDefaultLanguage, setLanguage,withTranslation, t } from 'react-multi-lang'
import './LivenessResult.css'

let lan =   localStorage.getItem('language'); 
setDefaultLanguage(lan)

class LivenessResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgSrc:SuccessURL,
            message:"",
            unableFlag: false,
            txtColor: "gray",            
        }
    }
    componentDidMount = () => {
        if(window.livenessResult === "SPOOF"){
            this.setState({imgSrc:FailedURL})
            this.setState({message:t('livenessResult.spoofMessage')})
        }else{
            this.setState({imgSrc:UnableURL})
            this.setState({message:t('livenessResult.unableMessage')})
            this.setState({unableFlag:true})
        }
        
    }
    render() {
        return (
            <div>
                 <Header headerText = {t('livenessResult.title')} txtColor = {this.state.txtColor}/>
                 <div className = "result-body-container">
                    <img src = {this.state.imgSrc} className = "resultMark"/>
                    <p className = "txtLivnessResult" style = {{color:this.state.txtColor}}> {this.state.message} </p>
                    {(this.state.unableFlag) && <p className = "txtErrorMessage" style = {{color:this.state.txtColor}}>{t('livenessResult.unableMesDes')}</p>}
                    {/* <div className = "spoof-container">
                        <p style={{marginLeft:'40px'}} > Face Liveness Confirmed</p>
                        <img src = {this.state.imgSrc} className = "spoofMark"/>
                    </div> */}
                    <Button
                        label={t('livenessResult.retryButton')}
                        onClick={() => {
                            this.props.history.push('photoliveness');
                        }}
                    />
                 </div>
            </div>
        )
    }
}
export default withTranslation(LivenessResult);