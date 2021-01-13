import React, { Component } from 'react';
import Header from "../../Components/header/header"
import SuccessURL from "../../assets/ic_success.png"
import FailedURL from "../../assets/ic_failed.png"
import UnableURL from "../../assets/ic_unable.png"
import Button from "../../Components/button/button"

class VideoChallengeResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sendHeaderText:'Video Challenge Result',
            imgSrc:SuccessURL,
            message:"",
            unableFlag: false            
        }
    }
    componentDidMount = () => {
        if(window.videochallengeresult === "PASSED"){
            this.setState({imgSrc:SuccessURL})
            this.setState({message:"Video Challenge is Great!"})
        }else{
            this.setState({imgSrc:FailedURL})
            this.setState({message:"Video Challenge is Failed"})
            this.setState({unableFlag:true})
        }
        
    }
    render() {
        return (
            <div>
                 <Header headerText = {this.state.sendHeaderText}/>
                 <div className = "result-body-container">
                    <img src = {this.state.imgSrc} className = "resultMark"/>
                    <p className = "txtLivnessResult"> {this.state.message} </p>
                    {(this.state.unableFlag) && <div>
                        <p className = "txtErrorMessage">challenge_1 score:{window.challenge1Score}</p>
                        <p className = "txtErrorMessage">challenge_2 score:{window.challenge2Score} </p>
                        <p className = "txtErrorMessage">challenge_3 score:{window.challenge3Score} </p>
                    </div>                    
                    }                    
                    <Button
                        label="Retry"
                        onClick={() => {
                            this.props.history.push('videoliveness');
                        }}
                    />

                 </div>
            </div>
        )
    }
}
export default VideoChallengeResult;