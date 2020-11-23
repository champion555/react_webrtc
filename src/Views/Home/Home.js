import React, { Component } from 'react';
import { withRouter } from "react-router";
import Button from "../../Components/startButton/startButton"
import ImageURL from "../../assets/ic_logo1.png"
import CheckURL from "../../assets/ic_check.png"
import './Home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ImageSrcs: ImageURL,
            sendHeaderText: 'Home',
            checkSrc: CheckURL,
            flag: false,
        }
    }
    componentDidMount = () => {
        
    }


    render() {
        return (
            <div>
                <div className="body-container">
                    <div style={{ background: "#7f00ff" }}>
                        <div className="logoView" style={{ height: window.innerHeight * 0.12, marginBottom: "8px", marginTop: window.innerHeight * 0.01 }}>
                            <img src={this.state.ImageSrcs} className="logoIcon" />
                        </div>
                        <div className="header">
                            <div className="companyName">Company Name</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", background: "white" }}>
                        <div className="companyDesc">(My Organization short name or slogan)</div>
                        <div className="content">
                            <div className="info">
                                <p className='heading'>VERIFY YOUR IDENTITY</p>
                                <p className="desc">To verify your identity, you will use your mobile device de capture following persional data:</p>
                            </div>
                            <div className="personal_data_list">
                                <div className="personal_data">
                                    <div className="title_panel">
                                        <div className="number">1</div>
                                        <div className="title"><p>Identity Document <span>(Choose One)</span></p></div>
                                    </div>
                                    <div className="data">
                                        <ul>
                                            <li>Passport</li>
                                            <li>National ID Card</li>
                                            <li>Residence Permit</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="personal_data">
                                    <div className="title_panel">
                                        <div className="number">2</div>
                                        <div className="title"><p>Proof of Address <span>(Choose One)</span></p></div>
                                    </div>
                                    <div className="data">
                                        <ul>
                                            <li>Electrical or Water bill document</li>
                                            <li>Gaz bill document</li>
                                            <li>Phone bill document</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="personal_data">
                                    <div className="title_panel">
                                        <div className="number">3</div>
                                        <div className="title"><p>Selfie Photo</p></div>
                                    </div>
                                </div>
                            </div>
                            <div className='termsOfService'>
                                By click on <strong>Start</strong> button you agree to our <a href="#">Terms of Service</a>. For more information see our <a href="#">Privacy Policy</a>
                            </div>
                        </div>
                        <Button
                            label="Start"
                            onClick={() => {
                                this.props.history.push('idmain');
                            }}
                        />
                        <div style ={{fontStyle:"italic", color:"#7f00ff",marginTop:"20px"}}>Powerd by BIOMIID</div>
                    </div>



                </div>
            </div>
        )
    }
}

export default withRouter(Home);
