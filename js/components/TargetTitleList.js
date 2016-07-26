/**
 * Created by Chen on 16/7/19.
 */
import React from 'react';
class TargetTitleList extends React.Component {
    handleTitleClick(val){
        this.props.handleTitleClick(val);
    }

    render() {
        var titleNode = this.props.targetDataList.map(((val,number) => {
            return <li onClick={this.handleTitleClick.bind(this,val)} key={number} className={this.props.currentUserId == val.userId?"active":""}  ><a href="#">{val.name}</a></li>
        }).bind(this))
        return <div className="clerk-list">
            <ul className="clerk">
                {titleNode}
            </ul>
        </div>
    }
}
export default TargetTitleList;