/**
 * Created by Chen on 16/7/19.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {getInitData, setCondition, getTargetDataPrepare} from '../actions/TargetAction';
import TargetCondition from './TargetCondition';
import TargetContent from './TargetContent';
class TargetApp extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showMask: false
        }
    }


    handleMask(show) {
        this.setState({showMask: show})
    }

    handleConditionChange(condition) {
        this.props.dispatch(setCondition(condition));
    }

    handleRequestTargetData() {
        this.handleMask(false);
        const {dispatch, session, condition} = this.props;
        dispatch(getTargetDataPrepare(session, condition));
    }

    render() {
        var maskNode = this.state.showMask ? <div className="mask"></div> : "";
        var loadingNode = this.props.isFetching ? <div className="loading"><em></em>努力加载中</div> : "";
        var tipNode = this.props.isFail ? <div className="tip"><p>{this.props.failDesc}</p></div> : "";
        var content = (this.props.targetDataList == undefined || this.props.targetDataList.length == 0 ) ?
            <div className="nodata" style={{width: 100 + "px", height: 100 + "px"}}><img className="nodata_img"
                                                                                         src="images/nodata.jpg"/></div>
            : <TargetContent condition={this.props.condition} targetDataList={this.props.targetDataList}/>;
        return (<div className="target-app">
            <TargetCondition condition={this.props.condition}
                             handleRequestTargetData={this.handleRequestTargetData.bind(this)}
                             handleMask={this.handleMask.bind(this)}
                             handleConditionChange={this.handleConditionChange.bind(this)}/>
            {content}{maskNode}{loadingNode}{tipNode}
        </div>);
    }

    componentDidMount() {
        const {dispatch, session, condition} = this.props;
        dispatch(getInitData(session, condition))
    }


}

function mapStateToProps(state) {
    const {targetDataList, condition, isFail, isFetching, failDesc} = state.initData
    const session = {
        waurl: 'HTTPS://link.yonyouup.com/eisproxy/T160288/ma/servlet/waservlet',
        session: 'cda6ced7-1a9a-4baa-9c25-e1bf53c4332f',
        userID: 'demo9'
    }
    const conditionTemp = condition == undefined ? {
        report_year: new Date().getFullYear(),
        report_demension: "department",
        report_metric: "1",
        report_dept: "",
        report_person: "",
        report_period: "",
        report_period2: new Date().getMonth() + 1,
        periodIndex: 0,
        demensionIndex: "",
        departments: []
    } : condition;

    return {
        targetDataList: targetDataList,
        isFetching: isFetching,
        condition: conditionTemp,
        session: session,
        isFail: isFail,
        failDesc: failDesc
    }
}


export default connect(mapStateToProps)(TargetApp)
