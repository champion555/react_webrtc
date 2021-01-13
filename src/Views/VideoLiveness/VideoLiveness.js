import React, { Component, useEffect, useState } from 'react';
import { withRouter } from "react-router";
import Webcam from "react-webcam";
import Header from '../../Components/header/header'
import backURL from '../../assets/ic_back.png'
import undetectedImgURL from '../../assets/ic_undetected1.png'
import detectedImgURL from '../../assets/ic_detected1.png'
import headLeftURL from '../../assets/ic_white_headleft.png'
import headRightURL from '../../assets/ic_white_headright.png'
import headDownURL from '../../assets/ic_white_headdown.png'
import smileURL from '../../assets/ic_white_smile.png'
import closeEyeURL from '../../assets/ic_white_closeeye.png'
import successURL from '../../assets/ic_success.png'
import failedURL from '../../assets/ic_failed.png'
import Button from '../../Components/videoLivenessButton/videoLivenessButton'
import { VideoChallenge } from '../../lib/AppUtils';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './VideoLiveness.css';

import { Config } from '../../Services/Config';
import ApiService from '../../Services/APIServices';

var lastNum = []
var numFlag = 0

export default function VideoLiveness(props) {
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false);
    const [apiFlag, setApiFlag] = React.useState(false);
    // const [failButtonFlag, setfailButtonFlag] = React.useState(false)
    const [resultTitle, setResultTitle] = React.useState(null);
    const [actionFlag, setActionFlag] = React.useState(false)
    const [randomNum, setRandomNum] = React.useState(null)
    const [recordedChunks, setRecordedChunks] = React.useState([]);
    const [cameraHeight, setCameraHeight] = React.useState(null);
    const [backButtonSrc] = React.useState(backURL);
    const [backgroundImgSrc, setBackgroundImgSrc] = React.useState(undetectedImgURL);
    const actionImgSrcs = [smileURL, closeEyeURL,headRightURL,  headLeftURL, headDownURL];
    const actionTitles = ["Smile", "Close eye","Turn your head right", "Turn your head left",  "Turn your head Down"];
    const [message, setMessage] = React.useState("You will be ask to perform thress actions to confirm your video liveness")
    const [livenessResultSrc, setLivenessResultSrc] = React.useState(successURL);

    useEffect(() => {
        if (window.innerHeight < 600) {
            setCameraHeight(window.innerHeight)
        }
        if (recordedChunks.length) {
            setTimeout(() => {
                handleLivenessToServer()
            }, 2000);
            // handleLivenessToServer()
        }
    }, [recordedChunks]);
    const getRandNumber = () => {
        console.log("button clicked")
        lastNum = [];
        var flag = [];
        for (var i = 0; i < 5; i++)
            flag.push(0);
        var current_index = 0;
        for (var i = 0; i < 3; i++) {
            while (true) {
                var x = Math.floor(Math.random() * 5);
                current_index = (current_index + x) % 5;
                if (flag[current_index] == 0) {
                    flag[current_index] = 1;
                    break;
                }
            }
        }
        for (var i = 0; i < 5; i++) {
            if (flag[i] == 1)
                lastNum.push(i);
        }

        console.log(lastNum);
        setCapturing(true)
        setMessage("Maintained your face correctly inside the oval frame")
        handleStartCaptureClick()

        // numFlag++
        // if (numFlag > 3) {
        //     setApiResultFlag(false)
        //     alert("go to next step")
        //     setRecordedChunks([])            
        //     numFlag = 0
        // } else {
        //     setApiResultFlag(false)
        //     setfailButtonFlag(false)
        //     setCapturing(true);
        //     setRandomNum(lastNum[numFlag-1])
        //     setActionFlag(true)
        //     setTimeout(() => {
        //         handleStartCaptureClick()
        //     }, 1000);
        // }
    }

    const handleStartCaptureClick = React.useCallback(() => {
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
        });
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start();
        console.log("recording start")
        setActionFlag(true)
        setRandomNum(lastNum[0])
        setTimeout(() => {
            setActionFlag(false)
        }, 2000);
        setTimeout(() => {
            setActionFlag(true)
            setRandomNum(lastNum[1])
        }, 3000);
        setTimeout(() => {
            setActionFlag(false)
        }, 5000);
        setTimeout(() => {
            setActionFlag(true)
            setRandomNum(lastNum[2])
        }, 6000);
        setTimeout(() => {
            setActionFlag(false)
            setMessage("You will be ask to perform three actions to confirm your video liveness")
            handleStopCaptureClick()
        }, 9000);
    }, [webcamRef, setCapturing, mediaRecorderRef]);

    const handleDataAvailable = React.useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStopCaptureClick = React.useCallback(() => {
        mediaRecorderRef.current.stop();
        console.log("video recording stopped")
        // setCapturing(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);

    const handleDownload = React.useCallback(() => {
        console.log(recordedChunks.length)
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "videoChallenge.webm";
            a.click();
            window.URL.revokeObjectURL(url);
            alert(url)
            setRecordedChunks([]);
        }
    }, [recordedChunks]);
    const handleLivenessToServer = React.useCallback(() => {
        handleDownload()
        setApiFlag(true)
        const blob = new Blob(recordedChunks, {
            type: "video/webm"
        });
        VideoChallenge(blob, lastNum[0] + 1, lastNum[1] + 1, lastNum[2] + 1, (total, progress) => {
        }).then(res => {
            var response = res.data;
            console.log(response.result)
            if (response.result === "PASSED") {
                window.videochallengeresult = response.result
                props.history.push('videochallengeresult')
                setApiFlag(false)
            } else {
                setApiFlag(false)
                window.videochallengeresult = response.result
                var challenge1 = response.raports.challenge_1.score
                var challenge2 = response.raports.challenge_2.score
                var challenge3 = response.raports.challenge_3.score
                console.log(challenge1)
                console.log(challenge2)
                console.log(challenge3)
                window.challenge1Score = response.raports.challenge_1.score
                window.challenge2Score = response.raports.challenge_2.score
                window.challenge3Score = response.raports.challenge_3.score
                props.history.push('videochallengeresult')
            }
        }).catch(e => {
            alert("the server is not working, Please try again.");
            setApiFlag(false)
            setActionFlag(false)
            setCapturing(false);
        })

    }, [recordedChunks]);

    const videoConstraints = {
        facingMode: "user"
    };

    return (
        <div>
            <div className="videoLivCamera_Container" style={{ height: window.innerHeight }}>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    mirrored={true}
                    width={"100%"}
                    height={cameraHeight}
                    videoConstraints={videoConstraints} />
            </div>
            <div className="videoLiv_bodyContainer" style={{ height: window.innerHeight }}>
                <div className="videoLiv_topBar" style={{ height: window.innerHeight * 0.07 }}>
                    <img src={backButtonSrc} onClick={() => this.props.history.push('poadoc')} className="btnBack" />
                    <h2 className="videoLiv_topBarTitle">Video Challenges</h2>
                    <div style={{ width: '10px' }}></div>
                </div>
                <div style={{ width: "100%", height: window.innerHeight * 0.13, background: "#7f00ff" }}>
                    <p className="videoLive_topMessage">{message}</p>
                </div>
                <div style={{ width: "100%", height: window.innerHeight * 0.63, position: "relative", backgroundImage: `url(${backgroundImgSrc})`, backgroundSize: "100% 100%" }}>
                    {/* <div style={{ width: "100%", display: "flex", alignItems: "center", flexDirection: "column", position: "absolute",bottom:"0px"}}>
                        {apiResultFlag && <div className="videoLiv_checkContainer">
                            <img src={livenessResultSrc} style={{ width: "20px", height: "20px" }} />
                            <p style={{ marginLeft: "10px", marginTop: "0px", marginBottom: "0px", color: "#fff" }}>{resultTitle}</p>
                        </div>}
                        {actionFlag && <div style={{ width: "200px", borderRadius: "10px", display: "flex", alignItems: "center", flexDirection: "column", background: "#000", opacity: "0.8" }}>
                            <img src={actionImgSrcs[randomNum]} style={{ width: "100px", height: "100px" }} />
                            <p style={{ color: "#fff", marginTop: "-5px" }}>{actionTitles[randomNum]}</p>
                        </div>}
                    </div> */}
                </div>
                <div style={{ width: "100%", height: window.innerHeight * 0.17, background: "#7f00ff", display: "flex", alignItems: "center", flexDirection: "column" }}>
                    <div style={{ width: "100%", display: "flex", alignItems: "center", flexDirection: "column", position: "absolute", marginTop: -window.innerHeight * 0.09 }}>
                        {/* {apiResultFlag && <div className="videoLiv_checkContainer">
                            <img src={livenessResultSrc} style={{ width: "20px", height: "20px" }} />
                            <p style={{ marginLeft: "10px", marginTop: "0px", marginBottom: "0px", color: "#fff" }}>{resultTitle}</p>
                        </div>} */}
                        {actionFlag && <div style={{ width: "200px", borderRadius: "10px", display: "flex", alignItems: "center", flexDirection: "column", background: "#000", opacity: "0.8" }}>
                            <img src={actionImgSrcs[randomNum]} style={{ width: "100px", height: "100px" }} />
                            <p style={{ color: "#fff", marginTop: "-5px" }}>{actionTitles[randomNum]}</p>
                        </div>}
                    </div>
                    {!capturing && <Button
                        label="Start Action"
                        onClick={getRandNumber} />}
                    {apiFlag && <div>
                        <Loader
                            type="Puff"
                            color="#ffffff"
                            height={50}
                            width={50}
                        />
                    </div>}
                    {/* {failButtonFlag && <Button
                        label="RETRY"
                        onClick={handleGotIt} />} */}
                    {/* <button onClick={handleDownload}>get random Number</button> */}
                    <p style={{ fontSize: "15px", fontStyle: "italic", color: "#fff", position: "absolute", bottom: "0px" }}>powerd by BIOMIID</p>
                </div>
            </div>

        </div>
    );
};