import React, { Component } from 'react';
import TabList from './TabList';

export class Header extends Component {
	render() {
		return (
			<div className="header">
				<p className="home"
					onClick={this.props.changeTab.bind(this, 0)}>
						Zain<br/>Aleshaiker
				</p>

				<div className="menu">
					<TabList tabs={this.props.tabs}
						activeTab={this.props.activeTab}
						changeTab={this.props.changeTab}/>
				</div>
			</div>
		);
	}
}

export default Header;