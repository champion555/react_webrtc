import React from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from './Views/Home/Home'
import VideoPage from './Views/Video/VideoPage'
import PhotoPage from './Views/Photo/PhotoPage'
import IDMainPage from './Views/IDMain/IDMain'
import IDDocCam from './Views/IDDocCamera/IDDocCamera'
import Result from './Views/Result/Result'
import POADocCam from './Views/POADocCamera/POADocCamera'
import IDDocResult from './Views/IDDocResult/IDDocResult'
import POADoc from './Views/POADoc/POADoc'
// import FaceLiveness from './Views/FaceLiveness/FaceLiveness'

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/video" component={VideoPage} />
                <Route exact path="/photo" component={PhotoPage} />
                <Route exact path="/result" component={Result} />
                <Route exact path="/idmain" component={IDMainPage} />
                <Route exact path="/iddoccam" component={IDDocCam} />
                <Route exact path="/poadoccam" component={POADocCam} />
                <Route exact path="/iddocresult" component={IDDocResult} />
                <Route exact path="/poadoc" component={POADoc} />
                {/* <Route exact path="/faceliveness" component={FaceLiveness} /> */}
            </Switch>
        </BrowserRouter>
    )
}

export default Routes;