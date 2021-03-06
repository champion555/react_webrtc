import React, { Component } from 'react';
import { withRouter } from "react-router";
import ImageURL from "../../assets/ic_back.png"
import "./header.css"

class header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ImageSrcs: ImageURL,
            url: props.url,
            background:"#7f00ff"
        }
    }
    goBack = () => {
        if (this.props.url === "video" || this.props.url === "photo" || this.props.url === "idmain") {
            this.props.history.push('')
            return
        }else if (this.props.url == "idresult"){
            this.props.history.push('idmain')
        }else{
            this.props.history.goBack()
        }
    }

    render() {
        return (
            <div className="HeaderView" style = {{background:this.props.headerBackground? this.props.headerBackground: this.state.background}}>
                {/* <img src={this.state.ImageSrcs} onClick={this.goBack} className="btnBack" /> */}
                <h2 className="txtTitle">{this.props.headerText}</h2>
                <div style={{ width: '10px' }}></div>
            </div>
        )
    }
}

export default withRouter(header);