import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";

import AdminMainPagePage from './pages/adminMainPage/adminMainPage'
import AdminManagers from "./pages/adminManagers/adminManagers";
import AdminGlass from "./pages/adminGlassPage/adminGlassPage";

const Routes = () => {
    return(
        <BrowserRouter>
            <BrowserRouter basename='/admin'>
                <Switch>
                    <Route exact path='/' component={AdminMainPagePage}/>
                    <Route exact path='/managers' component={AdminManagers}/>
                    <Route exact path='/glass' component={AdminGlass}/>
                </Switch>
            </BrowserRouter>
        </BrowserRouter>
    )
}

export default Routes;