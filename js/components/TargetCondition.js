/**
 * Created by Chen on 16/7/19.
 */
import React from 'react';
import {month} from '../utils/common';
class TargetCondition extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barShowIndex: undefined,
            departmentsAllSelect: false
        }
    }

    handleNavBarClick(index) {
        if (this.state.barShowIndex == index) {
            index = undefined;
        }
        this.props.handleMask(index != undefined);
        this.setState({
            barShowIndex: index
        })

    }

    handleYearClick(year) {
        var condition = this.props.condition;
        condition.report_year = year;
        this.props.handleConditionChange(condition);
        if(this.props.conditions.periodIndex != 0) {
            this.startRequest();
        }
    }

    handlePeriodIndexClick(index) {
        var condition = this.props.condition;
        condition.periodIndex = index;
        this.props.handleConditionChange(condition);
    }

    handlerMonthClick(index) {
        var condition = this.props.condition;
        condition.report_period2 = index + 1;
        this.props.handleConditionChange(condition);
        this.startRequest();
    }

    handleDepartmentClick(department) {
        department.isSelect = !department.isSelect;
        if (!department.isSelect) {
            this.setState({
                departmentsAllSelect: false
            })
        }
        this.props.handleConditionChange(this.props.condition)
    }

    handleDepartmentAllSelect() {
        var allSelect = !this.state.departmentsAllSelect;
        this.props.condition.departments.map(function (department) {
            department.isSelect = allSelect;
        })

        this.setState({
            departmentsAllSelect: allSelect
        })
    }

    handleDimensionClick(index) {
        var condition = this.props.condition;
        condition.demensionIndex = index;
        this.props.handleConditionChange(condition)
        if (index != 1) {
            this.startRequest();
        }
    }

    handleMetricClick(val) {
        var condition = this.props.condition;
        condition.report_metric = val.id;
        this.props.handleConditionChange(condition);
        this.startRequest();
    }

    handleOKClick() {
        this.props.handleRequestTargetData()
        this.startRequest();
    }

    handleClearClick() {
        var condition = this.props.condition;
        condition.departments.map(function (val) {
            val.isSelect = false;
        })
        this.props.handleConditionChange(condition);
    }

    startRequest() {
        this.setState({
            barShowIndex: undefined
        });
        this.props.handleMask(false);
        this.props.handleRequestTargetData();
    }

    render() {

        var index = this.state.barShowIndex;
        var report_year = new Date().getFullYear();
        var yearNode = [report_year - 1, report_year, report_year + 1].map(val => {
            return <p key={val} className={val == this.props.condition.report_year ? "active" : ""}
                      onClick={this.handleYearClick.bind(this, val)}>{val + "年"}</p>
        })

        var report_period_Node;
        var periodIndex = this.props.condition.periodIndex;

        var departmentsNode = "";
        if (this.props.condition.departments != undefined) {
            departmentsNode = this.props.condition.departments.map(function (val) {
                return <p onClick={this.handleDepartmentClick.bind(this, val)}
                          key={val.referid}>{val.refername}<label><span
                    className={val.isSelect ? "icon-check-on" : "icon-check"}></span></label></p>
            }.bind(this));
        }

        var departmentAllNode = <p onClick={this.handleDepartmentAllSelect.bind(this)}>全部<label><span
            className={this.state.departmentsAllSelect ? "icon-check-on" : "icon-check"}></span></label></p>;

        var metric = "";
        if (this.props.condition.targetList != undefined) {

            metric = this.props.condition.targetList.map(function (val) {
                return <p key={val.id} className={val.id == this.props.condition.report_metric ? "active" : ""}
                          onClick={this.handleMetricClick.bind(this, val)}>{val.name}</p>
            }.bind(this))
        }


        switch (this.props.condition.periodIndex) {

            case 0:
                report_period_Node = <div id="period_content" className="nav-content">
                    <div className="nav-list-02 nav-list-06">
                        {yearNode}
                    </div>
                    <div className="nav-list-03">
                        {
                            month.map(function (val, number) {
                                return <p className={this.props.condition.report_period2 == number + 1 ? "active" : ""}
                                          key={number} onClick={this.handlerMonthClick.bind(this, number)}>{val}月</p>
                            }.bind(this))
                        }
                    </div>
                </div>
                break;
            case 1:
            case 2:
                report_period_Node = <div id="period_content_year" className="nav-content">
                    <div className="nav-list-07">
                        {yearNode}
                    </div>
                </div>
                break;
        }

        return (
            <div className="topfix">
                <div className="navbar">
                    <a id="Dimension" className={ index == 0 ? "active" : ""}
                       onClick={this.handleNavBarClick.bind(this, 0)}>维度<i
                        className="icon-rowbottom"></i></a><span>|</span>
                    <a id="Metric" className={index == 1 ? "active" : ""}
                       onClick={this.handleNavBarClick.bind(this, 1)}>指标<i
                        className="icon-rowbottom"></i></a><span>|</span>
                    <a id="Period" className={index == 2 ? "active" : ""}
                       onClick={this.handleNavBarClick.bind(this, 2)}>期间单位<i
                        className="icon-rowbottom"></i></a>
                </div>
                <div className="mask-content">

                    <ol className={index == 0 ? "block" : ""}>
                        <ul id="dimension_list" className="nav-list">
                            {
                                ["部门", "业务员", "我的"].map(function (val, number) {
                                    return <li onClick={this.handleDimensionClick.bind(this, number)}
                                               className={number == this.props.condition.demensionIndex ? "active" : ""}
                                               key={val}>{number == this.props.condition.demensionIndex ?
                                        <span className="circle"></span> : ""}{val}</li>
                                }.bind(this))
                            }
                        </ul>
                        <div className="nav-content">
                            <div className="nav-list-04">
                                {
                                    this.props.condition.demensionIndex == 1 ? departmentAllNode : ""
                                }
                                {
                                    this.props.condition.demensionIndex == 1 ? departmentsNode : ""
                                }
                            </div>
                        </div>
                        {
                            this.props.condition.demensionIndex == 1 ?
                                <div id="dimension_list_btn_group" className="nav-btn-group">
                                    <a id="clear_dimension_list" href="#" onClick={this.handleClearClick.bind(this)}
                                       className="btn-default">清空选择</a>
                                    <a id="ok_dimension_list" href="#" className="btn-info"
                                       onClick={this.handleOKClick.bind(this)}>确定</a>
                                </div> : ""
                        }

                    </ol>
                    <ol className={index == 1 ? "block" : ""}>
                        <ul className="nav-list">
                            <li className="active"><span className="circle"></span>指标</li>
                        </ul>
                        <div className="nav-content">
                            <div className="nav-list-01">
                                {
                                    metric
                                }
                            </div>

                        </div>
                    </ol>
                    <ol className={index == 2 ? "block" : ""}>
                        <ul id="period_list" className="nav-list">
                            {['按周', '按月', '按季'].map((val, number) => {
                                return <li key={val} className={periodIndex == number ? "active" : ""}
                                           onClick={this.handlePeriodIndexClick.bind(this, number)}> {periodIndex == number ?
                                    <span className="circle"></span> : ""}{val}</li>
                            })}
                        </ul>
                        {report_period_Node}
                    </ol>
                </div>
            </div>);
    }
}
export default TargetCondition;