import React, { Component } from 'react';
import { withRouter } from "react-router";
import Header from "../../Components/header/header"
import Button from "../../Components/button/button"
import ImageURL from "../../assets/ic_logo1.png"
import CheckURL from "../../assets/ic_check.png"
import Checkbox from "react-custom-checkbox";
import Icon, { FontAwesome, Feather } from 'react-web-vector-icons';
import './Home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ImageSrcs: ImageURL,
            sendHeaderText: 'Home',
            checkSrc:CheckURL,
            flag: false,
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
                            if(this.state.flag)
                                this.props.history.push('idmain');
                            else
                                alert('Please the General Condition and Policy')
                        }}
                    />
                    <Checkbox
                        icon={<img src={this.state.checkSrc} style={{ width: 14 }} />}
                        name="my-input"
                        checked={false}
                        onChange={(value) => {
                            this.setState({flag:value})
                            let p = {
                                isTrue: value,
                            };
                            return alert(value);
                        }}
                        borderColor="#ffffff"
                        labelStyle={{ marginLeft: 5, userSelect: "none", borderColor: "white" }}
                        label="I accept the General Condition and Policy"
                    />

                    <Button
                        label="Photo Face Liveness"
                        onClick={() => {
                            window.cameraMode = "front"
                            this.props.history.push('photoliveness');
                        }}
                    />
                    {/* <Button
                        label="Video Face Liveness"
                        className="belowBtn"
                        onClick={() => {
                            window.cameraMode = "front"
                            this.props.history.push('video');
                        }}
                    /> */}

                </div>
            </div>
        )
    }
}

export default withRouter(Home);
