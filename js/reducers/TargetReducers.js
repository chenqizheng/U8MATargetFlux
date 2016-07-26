import {combineReducers} from 'redux';
import {REQUEST_INITDATA, RECEVIER_INITDATA,REQUEST_INITDATA_FAIL,CHANGE_CONDITION,RECEVIER_TARGETDATA,REQUEST_TARGETDATA} from '../actions/TargetAction';

function initData(state = {}, action) {
    switch (action.type) {
        case REQUEST_INITDATA:
            return Object.assign({}, state, {
                isFetching: true,
                isFail:false,
            });
        case RECEVIER_INITDATA:
            return Object.assign({}, state, {
                isFetching: false,
                isFail:false,
                condition: action.conditions
            });
        case REQUEST_INITDATA_FAIL:
            return Object.assign({},state,{
                isFetching:false,
                isFail:true,
                failDesc:action.failDesc
            });
        case CHANGE_CONDITION:
            return Object.assign({},state,{
                condition:action.condition
            });
        case RECEVIER_TARGETDATA:
            return Object.assign({},state,{
                isFetching: false,
                isFail:false,
                targetDataList:action.targetDataList
            });

        case REQUEST_TARGETDATA:
            return Object.assign({},state,{
                isFetching: true,
                isFail:false,
            });

        default:
            return state;
    }
}
const TargetReducer = combineReducers({
    initData
})

export default TargetReducer
