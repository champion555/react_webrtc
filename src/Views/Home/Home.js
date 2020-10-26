import React, { Component } from 'react';
import { withRouter } from "react-router";
import Header from "../../Components/header/header"
import Button from "../../Components/button/button"
import ImageURL from "../../assets/ic_logo1.png"

import './Home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ImageSrcs: ImageURL,
            sendHeaderText: 'Home',
            flag: false
        }
    }

    componentDidMount = () => {
    }


    render() {
        return (
            <div>
                <div className="body-container">
                    <div className="logoView" style={{ height: window.innerHeight * 0.15, marginBottom: window.innerHeight * 0.2, marginTop: window.innerHeight * 0.09 }}>
                        <img src={this.state.ImageSrcs} className="logoIcon" />
                    </div>
                    <Button
                        label="Start"
                        onClick={() => {
                            this.props.history.push('idmain');
                            
                        }}
                    />   

                    <Button
                        label="Photo Face Liveness"
                        onClick={() => {
                            window.cameraMode = "front"
                            // this.props.history.push('photo');
                            this.props.history.push('faceliveness');
                            
                            
                        }}
                    />
                    <Button
                        label="Video Face Liveness"
                        className="belowBtn"
                        onClick={() => {
                            window.cameraMode = "front"
                            this.props.history.push('video');
                        }}
                    />

                </div>
            </div>
        )
    }
}

export default withRouter(Home);
