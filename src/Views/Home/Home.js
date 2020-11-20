import React, { Component } from 'react';
import { withRouter } from "react-router";
import Header from "../../Components/header/header"
import Button from "../../Components/button/button"
import ImageURL from "../../assets/ic_logo1.png"
// import { Checkbox } from '@progress/kendo-react-inputs';

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
                    {/* <Checkbox defaultChecked={this.state.flag} label={'I accepted the geneal condition and policy'}
                        onChange={() => {
                            if(this.state.flag) {
                                this.setState({
                                    flag: false
                                })
                            } else {
                                this.setState({
                                    flag: true
                                })
                            }
                           
                        }}
                        style ={{marginTop:"20px"}}
                    />    */}

                    <Button
                        label="Photo Face Liveness"
                        onClick={() => {
                            window.cameraMode = "front"
                            // window.location.reload(false);
                            // this.props.history.push('photo');
                            // this.props.history.push('faceliveness');
                            // this.props.history.replace("faceliveness")
                            this.props.history.push('photoliveness');

                            
                            
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
