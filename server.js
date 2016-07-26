/**
 * Created by Chen on 16/7/26.
 */

import path from 'path';
import {match, RouterContext} from 'react-router';
import createLocation from 'history/lib/createLocation';
import createMemoryHistory from 'history/lib/createMemoryHistory';

import express from "express";
import React from "react";
import {renderToString} from 'react-dom/server';
import {Provider} from "react-redux";
import configurable from './js/stores/TargetStore';
import createRoutes from './js/router/routes';
let server = express();
server.use(express.static('css', {
    etag: true,
    maxAge: 604800000
}));
server.use('/build', express.static(path.join(__dirname, 'build')));
server.use('/css', express.static(path.join(__dirname, 'css')));  //设置build文件夹为存放静态文件的目录
server.use('/images', express.static(path.join(__dirname, 'images')));  //设置build文件夹为存放静态文件的目录
server.use(handleRender);
function handleRender(req, res) {
    console.log("url = " + req.url);
    const history = createMemoryHistory();
    const routes = createRoutes(history)
    const location = createLocation(req.url);

    // req.url is the full url
    match({routes, location}, (err, redirectLocation, renderProps) => {
        if (err) {
            return res.status(500).send(err.message)
        }

        if (!renderProps) {
            return res.status(404).send('not found')
        }
        const store = configurable();
        const initialView = renderToString(
            <Provider store={store}>
                { <RouterContext {...renderProps} /> }
            </Provider>
        )

        const initialState = store.getState();
        console.log('state' + JSON.stringify(initialState));
        res.status(200).send(renderFullPage(initialView, initialState));
    })
}

function renderFullPage(html, initialState) {
    return `
        <!DOCTYPE html>
            <!--[if lt IE 7 ]> <html lang="en" class="ie6" > <![endif]-->
            <!--[if IE 7 ]>    <html lang="en" class="ie7" > <![endif]-->
            <!--[if IE 8 ]>    <html lang="en" class="ie8" > <![endif]-->
            <!--[if IE 9 ]>    <html lang="en" class="ie9" > <![endif]-->
            <!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="" > <!--<![endif]-->
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
              <title>react-redux-router</title>
              <link href="./css/target.css" rel="stylesheet">

            </head>
            <body>

            <div id="react">${html}</div>
            <script>
                window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
            </script>

            <script src="./build/bundle.js"></script>

            </body>
        </html>
        `
}

server.listen(3000, () => {
    console.log('this server is running on ' + 3000)
});