/**
 * Created by Chen on 16/7/19.
 */
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import TargetApp from './components/TargetApp';
import configurable from './stores/TargetStore';
const store = configurable();

render(
    <Provider store={store}>
        <TargetApp />
    </Provider>
    , document.getElementById('react'));
