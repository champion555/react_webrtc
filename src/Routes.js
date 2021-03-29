import React from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ValidationPage from './Views/ValidationPage/ValidationPage'
import LivenessHelp from './Views/LivenessHelp/LivenessHelp'
import Home from './Views/Home/Home'
import VideoPage from './Views/Video/VideoPage'
import IDMainPage from './Views/IDMain/IDMain'
import Result from './Views/Result/Result'
import IDDocResult from './Views/IDDocResult/IDDocResult'
import POADoc from './Views/POADoc/POADoc'
import POAVeriHelp from './Views/POAVeriHelp/POAVeriHelp'
import PhotoLiveness from './Views/PhotoLiveness/PhotoLiveness'
import PhotoLivenessCamera from './Views/PhotoLivenessCamera/PhotoLivenessCamera'
import LivenessResult from './Views/LivenessResult/LivenessResult'
import IDDocumentCamera from './Views/IDDocumentCamera/IDDocumentCamera'
import VideoLiveness from './Views/VideoLiveness/VideoLiveness'
import VideoChallengResult from './Views/VideoChallengeResult/VideoChallengeResult'
import DocumentCountry from './Views/DocumentCountry/DocumentCountry'
import POACamera from './Views/POACamera/POACamera'
import IDDocCamera from './Views/IDDocCammera/IDDocCamera'

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path = "/" component = {ValidationPage}/>
                <Route exact path="/home" component={Home} />
                <Route exact path="/clientId=:clientId&applicantId=:applicantId&checkId=:checkId&checkType=:checkType&env=:env" component={Home} />
                <Route exact path ="/livenesshelp" component = {LivenessHelp}/>
                <Route exact path="/video" component={VideoPage} />
                <Route exact path="/result" component={Result} />
                <Route exact path="/idmain" component={IDMainPage} />
                <Route exact path="/iddocumentcamera" component={IDDocumentCamera} />
                <Route exact path="/iddocresult" component={IDDocResult} />
                <Route exact path="/poadoc" component={POADoc} />
                <Route exact path="/poaverihelp" component={POAVeriHelp} />
                <Route exact path="/photoliveness" component={PhotoLiveness} />
                <Route exact path="/photolivenesscamera" component={PhotoLivenessCamera} />
                <Route exact path="/livenessresult" component={LivenessResult} />
                <Route exact path="/videoliveness" component={VideoLiveness} />
                <Route exact path="/videochallengeresult" component={VideoChallengResult} />
                <Route exact path="/documentcountry" component={DocumentCountry} />
                <Route exact path="/poacamera" component={POACamera} /> 
                <Route exact path="/iddoccamera" component={IDDocCamera} /> 

            </Switch>
        </BrowserRouter>
    )
}

export default Routes;