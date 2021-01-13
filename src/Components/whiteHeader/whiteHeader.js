import React, { Component } from 'react';
import { withRouter } from "react-router";
import ImageURL from "../../assets/ic_cancel.png"
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import Button from '../button/button'
import ContinueButton from "../POAButton/POAButton"
import "./whiteHeader.css"



class whiteHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ImageSrcs: ImageURL,
            url: props.url,
            modalOpen: false,
            txtColor: 'gray'
        }
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
        return (
            <div className="whiteHeaderView">
                <img src={this.state.ImageSrcs} onClick={this.onOpenModal} className="whitebtnBack" />
                <p className="whitetxtTitle" style={{ color: this.props.txtColor }}>{this.props.headerText}</p>
                <div style={{ width: '10px' }}></div>

                <Modal open={this.state.modalOpen} showCloseIcon={false} center>
                    <div className="modalView" style={{ height: window.innerHeight * 0.5 }}>
                        <div style={{ borderBottom: "solid 1px", borderColor: this.state.txtColor, width: "100%" }}>
                            <h2 style={{ paddingLeft: "30px", paddingRight: "30px", paddingTop: "10px", paddingBottom: "10px", color: "gray" }}>Leaving so soon?</h2>
                        </div>
                        <div>
                            <p style={{ color: this.state.txtColor, fontSize: "18px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px" }}>Are you sure you want to exit the identification process?</p>
                        </div>
                        <div style={{ position: "absolute", bottom: "15px", width: "100%", display: "flex", alignItems: "center", flexDirection: "column" }}>
                            <Button
                                label="EXIT"
                                onClick={this.onEXit} />
                            <ContinueButton
                                label="CONTIMUE"
                                onClick={this.onCloseModal} />
                        </div>


                    </div>

                </Modal>
            </div>
        )
    }
}

export default withRouter(whiteHeader);