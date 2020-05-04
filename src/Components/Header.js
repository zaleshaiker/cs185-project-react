import React, { Component } from 'react';
import TabList from './TabList';
import { Link } from 'react-router-dom';

export class Header extends Component {
	render() {
		return (
			<div className="header">
				<Link className="home-text" to="/cs185-project-react/"
					onClick={this.props.changeTab.bind(this, 0)}>
					Zain<br/>Aleshaiker
				</Link>

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