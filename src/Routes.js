import React from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from './Views/Home/Home'
import VideoPage from './Views/Video/VideoPage'
import IDMainPage from './Views/IDMain/IDMain'
import Result from './Views/Result/Result'
import IDDocResult from './Views/IDDocResult/IDDocResult'
import POADoc from './Views/POADoc/POADoc'
import PhotoLiveness from './Views/PhotoLiveness/PhotoLiveness'
import LivenessResult from './Views/LivenessResult/LivenessResult'
import IDDocumentCamera from './Views/IDDocumentCamera/IDDocumentCamera'
import VideoLiveness from './Views/VideoLiveness/VideoLiveness'
import VideoChallengResult from './Views/VideoChallengeResult/VideoChallengeResult'
import DocumentCountry from './Views/DocumentCountry/DocumentCountry'
import POACamera from './Views/POACamera/POACamera'

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/client_id=:client_id&applicantId=:applicantId&checkId=:checkId&env=:env" component={Home} />
                <Route exact path="/video" component={VideoPage} />
                <Route exact path="/result" component={Result} />
                <Route exact path="/idmain" component={IDMainPage} />
                <Route exact path="/iddocumentcamera" component={IDDocumentCamera} />
                <Route exact path="/iddocresult" component={IDDocResult} />
                <Route exact path="/poadoc" component={POADoc} />
                <Route exact path="/photoliveness" component={PhotoLiveness} />
                <Route exact path="/livenessresult" component={LivenessResult} />
                <Route exact path="/videoliveness" component={VideoLiveness} />
                <Route exact path="/videochallengeresult" component={VideoChallengResult} />
                <Route exact path="/documentcountry" component={DocumentCountry} />
                <Route exact path="/poacamera" component={POACamera} /> 

            </Switch>
        </BrowserRouter>
    )
}

export default Routes;