/**
 * Created by Chen on 16/7/19.
 */
import {month, fmoney} from '../utils/common'
import React from 'react';
class TargetDataList extends React.Component {

    getDataTitle(index) {
        var title = this.props.condition.report_year + "年";
        var periodIndex = this.props.condition.periodIndex;
        if (periodIndex == 0) {
            title = title + month[parseInt(this.props.condition.report_period2) - 1] + "月" + "第" + month[index] + "周";
        } else if (periodIndex == 1) {
            title = title + month[index] + "月";
        } else if (periodIndex == 2) {
            title = title + "第" + month[index] + "季度"
        }
        return title;
    }

    formatData(data) {
        var report_metric = this.props.condition.report_metric;
        if (report_metric == "1" || report_metric == "2" || report_metric == "3") {
            return fmoney(data);
        } else {
            return data;
        }
    }


    render() {
        var max = this.props.targetData.max;
        var targeDataNode = this.props.targetData.data.map(((data, number) => {
                var realValPercent = max == 0 ? 2 : data.realval * 68 / max + 2;
                var targetValPercent = max == 0 ? 2 : data.targetval * 68 / max + 2;
                return <li key={number}>
                    <h5>{this.getDataTitle(number)}</h5>
                    <div className="target-01">差异<span>{this.formatData(data.diff)}</span>完成率<em>{data.rate }</em></div>
                    <div className="progress">
                        <div className="progress-bar first" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                             aria-valuemax="100" style={{width: realValPercent + '%'}}>
                        </div>
                        <span>{this.formatData(data.realval)}</span>
                    </div>
                    <div className="progress">
                        <div className="progress-bar second" role="progressbar" aria-valuenow="34" aria-valuemin="0"
                             aria-valuemax="100" style={{width: targetValPercent + '%'}}>
                        </div>
                        <span>{this.formatData(data.targetval)} </span>
                    </div>
                </li>
            }).bind(this)
        )
        return <div className="target-list">
            <ul>
                {targeDataNode}
            </ul>
        </div>;
    }
}
export default TargetDataList;