/**
 * Created by Chen on 16/7/19.
 */
import React from 'react';
import TargetTitleList from '../components/TargetTitleList';
import TargetDataList from '../components/TargetDataList';
class TargetContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUserId: this.props.targetDataList[0].userId
        }
    }

    handleTitleClick(val) {
        this.setState({
            currentUserId: val.userId
        })
    }

    render() {
        var currentTargetData = this.props.targetDataList.filter(val => {
            return val.userId == this.state.currentUserId
        })[0];
        return <div><TargetTitleList currentUserId={this.state.currentUserId}
                                     targetDataList={this.props.targetDataList}
                                     handleTitleClick={this.handleTitleClick.bind(this)}/>
            <div className="target-title">
                <ul>
                    <li><i className="icon-green-line"></i>实际值</li>
                    <li><i className="icon-blue-line"></i>目标值</li>
                </ul>
                <span>{currentTargetData.name.length > 12 ? currentTargetData.name.substr(0, 12) + "..." : currentTargetData.name
                }</span></div>
            <TargetDataList condition={this.props.condition} targetData={currentTargetData}/>
        </div>
    }
}
export default TargetContent;