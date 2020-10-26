import React, { Component } from 'react';
import Header from "../../Components/header/header"
import SuccessURL from "../../assets/ic_success.png"
import FailedURL from "../../assets/ic_failed.png"
import Button from "../../Components/button/button"

import './Result.css'

class Result extends Component {
    constructor(props) {
        super(props);
        if (props.location && props.location.state) {
            var score = props.location.state.score;
            // var threshold = props.location.state.threshold;
            var threshold = 0.9

            var message = score >= threshold ? 'Liveness confirmed' : 'Spoofing Detected';
            var img = score >= threshold ? SuccessURL : FailedURL
            var hideRetry = false;
            if (score >= threshold) hideRetry = true;

            if (score >= 0) {

            } else {
                message = 'Unable to confirm Liveness'
            }
            this.state = {
                sendHeaderText: 'Liveness Check Result',
                score: score,
                message: message,
                error_message: props.location.state.message,
                imgSrc: img,
                frameHeight: window.innerHeight - 50,
                hideRetry: hideRetry,
                showScroe: score >= 0
            }
        } else {
            this.state = { sendHeaderText: 'Liveness Check Result', }
            this.props.history.push('')
        }

        console.log(props)
    }
    // ComponentDidamount = () => {
    //     console.log("home")
    // }

    updateDimensions = () => {
        this.setState({ frameHeight: window.innerHeight });
    };
    componentDidMount() {
        // window.addEventListener('resize', this.updateDimensions);
    }

    render() {
        var { score, threshold, message } = this.state;
        return (
            <div>
                <Header headerText={this.state.sendHeaderText} url="result" />
                <div className="result-container" style={{ height: this.state.frameHeight }}>
                    <img src={this.state.imgSrc} className="resultMark" />
                    <div>
                        <p className="txtLivnessResult">{message}</p>
                        {this.state.showScroe ? <div className="socre-container">
                            <p style={{}} > Score: &nbsp;&nbsp; {score}</p>
                        </div> : null}

                    </div>
                    {this.state.showScroe ? null : <div className="errorMessage">{this.state.error_message}</div>}
                    {!this.state.hideRetry ? <div className="back-group" >
                        <Button
                            label="Re-try"
                            onClick={() => {
                                this.props.history.goBack()
                            }}
                            btnClass="black"
                            style={{ minWidth: '200px', margin: 'auto', marginTop: '15px' }}
                        />
                    </div> : null}

                </div>
            </div>
        )
    }
}
export default Result;