// 路由

import React from 'react';
import {Router, Route, IndexRoute, Redirect} from 'react-router'
import TargetApp from "../components/TargetApp"

function routes(history) {
    return (
        <Router history={history}>
            <Route path="/" component={TargetApp}>
            </Route>
        </Router>
    )
}

export default routes;