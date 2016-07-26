/**
 * Created by Chen on 16/7/20.
 */
import {sendWaRequest} from '../utils/common';
export const REQUEST_INITDATA = "request_initdata";
export const RECEVIER_INITDATA = "recevier_initdata";
export const REQUEST_INITDATA_FAIL = "request_initdata_fail";
export const CHANGE_CONDITION = "change_condition";
export const REQUEST_TARGETDATA = "request_targetdata";
export const RECEVIER_TARGETDATA = "receiver_targedata";
export const REQUEST_TARGETDATA_FAIL = "request_targetdata_fail";
export const TARGETDATA_NODATA = "targetdata_nodata";

export function requestInitData() {
    return {
        type: REQUEST_INITDATA,
    }
}

export function setCondition(condition) {
    return {
        type: CHANGE_CONDITION,
        condition
    }
}

export function recevierInitData(conditions) {
    return {
        type: RECEVIER_INITDATA,
        conditions
    }
}

export function requestInitDataFail(failDesc) {
    return {
        type: REQUEST_INITDATA_FAIL,
        failDesc
    }
}

export function requestTargetData() {
    return {
        type: REQUEST_TARGETDATA,
    }
}

export function receiverTargetData(targetDataList) {
    return {
        type: RECEVIER_TARGETDATA,
        targetDataList
    }
}

export function getHRPersonList(session, condition, dispatch) {
    var deptIds = "";
    condition.departments.forEach(val => {
        deptIds = deptIds + val.referid + ",";
    });
    var wacomponents = [{
        componentid: 'WAASARCHIVEREF',
        actions: {
            action: [{
                actiontype: "getHRPersonReferList",
                reqparams: {
                    "Params": [{
                        "value": "",
                        "@id": "referid"
                    }, {
                        "value": "",
                        "@id": "refermark"
                    }, {
                        "value": "",
                        "@id": "condition"
                    }, {
                        "value": deptIds,
                        "@id": "deptids"
                    }]
                }
            }]
        }
    }]

    return sendWaRequest(session, wacomponents, json => {
        var actionResponse = json.wacomponents.wacomponent[0].actions.action[0].resresult;
        var personList;
        if (actionResponse.flag == "1") {
            return;
        } else {
            try {
                personList = actionResponse.servicecodesres.servicecoderes[0].resdata.struct[0].referlist.group[0].referinfo;
            } catch (e) {
                personList = [];
            }
            if (personList.length != 0) {
                getTargetData(session, condition, dispatch)
            } else {
                dispatch(receiverTargetData([]))
            }
        }
    }, e => {
    });
}

export function getTargetDataPrepare(session, condition) {
    return dispatch => {
        var report_dept = "";
        condition.departments.forEach(val => {
            report_dept = report_dept + val.referid + ",";
        });
        dispatch(requestTargetData());
        return getHRPersonList(session, condition, dispatch)
    }
}

export function getTargetData(session, condition, dispatch) {
    var report_dept = "";
    condition.departments.forEach(val => {
        report_dept = report_dept + val.referid + ",";
    });

    dispatch(requestTargetData());
    var wacomponents = [{
        componentid: 'WACRMOBJECT',
        actions: {
            action: [{
                actiontype: "getSaleTargetsData",
                reqparams: {
                    "Params": [{
                        "value": session.userID,
                        "@id": "userid"
                    }, {
                        "value": condition.report_year,
                        "@id": "report_year"
                    }, {
                        "value": condition.report_demension,
                        "@id": "report_demension"
                    }, {
                        "value": condition.report_metric,
                        "@id": "report_metric"
                    }, {
                        "value": report_dept,
                        "@id": "report_dept"
                    }, {
                        "value": condition.report_person,
                        "@id": "report_person"
                    }, {
                        "value": condition.report_period,
                        "@id": "report_period"
                    }, {
                        "value": condition.report_period2,
                        "@id": "report_period2"
                    }]
                }
            }]
        }
    }];

    return sendWaRequest(session, wacomponents, json => {
        // console.log("target " + JSON.stringify(json))
        var actionResponse = json.wacomponents.wacomponent[0].actions.action[0].resresult;
        if (actionResponse.flag == "1") {
            return;
        } else {
            var dataList;
            try {
                dataList = JSON.parse(actionResponse.servicecodesres.servicecoderes[0].resdata.struct[0].datavalue[0].value);
            } catch (e) {
                dataList = [];
            }
            var targetData = [];
            var index = 0;
            for (var userId in dataList) {
                var userData = new Object();
                var data = dataList[userId];
                var name = data.demensionName;
                index++;
                userData.userId = userId;
                userData.name = name;
                var max = 0;
                var list = []
                var i = 0;
                var temp;
                var memberIndex = 0;
                for (var member in data) {
                    if (member == "demensionName") {
                        memberIndex++;
                        continue;
                    }
                    //接口返回合计数，前端不需要
                    if (Object.getOwnPropertyNames(data).length - 4 - 1 < memberIndex) {
                        break;
                    }

                    if (i == 0) {
                        temp = new Object();
                        temp.realval = data[member]
                        if (max < data[member]) {
                            max = data[member];
                        }
                        i++;
                    } else if (i == 1) {
                        temp.targetval = data[member]
                        if (max < data[member]) {
                            max = data[member];
                        }
                        i++;
                    } else if (i == 2) {
                        temp.diff = data[member]
                        i++;
                    } else if (i == 3) {
                        temp.rate = data[member]
                        i = 0;
                        list[list.length] = temp;
                    }
                    memberIndex++;
                }
                userData.data = list;
                userData.max = max;
                targetData[targetData.length] = userData;
            }

            dispatch(receiverTargetData(targetData))
        }
    }, e => {
        dispatch(requestInitDataFail("无法连接到服务器"))
    })

}

export function getInitData(session, condition) {
    return dispatch => {
        dispatch(requestInitData(session, condition));
        var wacomponents = [{
            componentid: 'WAASARCHIVEREF',
            actions: {
                action: [{
                    actiontype: "getDepartmentReferList",
                    reqparams: {
                        "Params": [{
                            "value": "",
                            "@id": "referid"
                        }, {
                            "value": "",
                            "@id": "refermark"
                        }, {
                            "value": "",
                            "@id": "condition"
                        }]
                    }
                }]
            }
        }, {
            componentid: 'WACRMOBJECT',
            actions: {
                action: [{
                    actiontype: "getTargetConditions",
                    reqparams: {
                        "Params": [{
                            "value": session.userID,
                            "@id": "userid"
                        }]
                    }
                }]
            }
        }];
        return sendWaRequest(session, wacomponents, json => {
            console.log("init_data_response")
            var components = json.wacomponents.wacomponent;
            var departments = [];
            var targetList = [];
            var isSuccess = false;
            components.forEach(function (wacomponent) {
                var actionResponse = wacomponent.actions.action[0].resresult;
                if (actionResponse.flag == "1") {
                    dispatch(requestInitDataFail(actionResponse.desc))
                } else {
                    isSuccess = true;
                    if (wacomponent.componentid == "WACRMOBJECT") {
                        targetList = JSON.parse(wacomponent.actions.action[0].resresult.servicecodesres.servicecoderes[0].resdata.struct[0].datavalue[0].value).list;
                    } else if (wacomponent.componentid == "WAASARCHIVEREF") {
                        try {
                            departments = (actionResponse.servicecodesres.servicecoderes[0].resdata.struct[0].referlist.group[0].referinfo);
                        } catch (e) {
                            departments = [];
                        }
                    }
                }
            })

            condition.departments = departments;
            condition.targetList = targetList;
            if(isSuccess){
                dispatch(recevierInitData(condition))
            }
        }, e => {
            dispatch(requestInitDataFail("无法连接到服务器"))
        })
    }
}
