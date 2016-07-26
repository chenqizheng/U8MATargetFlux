import {createStore, applyMiddleware,compose} from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import TargetReducers from '../reducers/TargetReducers';
export default function configTargetStore(preloadedState) {
    const store = createStore(
        TargetReducers,
        preloadedState,
        compose(
            applyMiddleware(thunkMiddleware,createLogger())
        )

    )
    // applyMiddleware(thunkMiddleware, createLogger())
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers/TargetReducers', () => {
            const nextRootReducer = require('../reducers/TargetReducers').default
            store.replaceReducer(nextRootReducer)
        })
    }
    return store;

}