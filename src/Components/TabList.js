import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class TabList extends Component {
	addStyling = (id) => {
		if (this.props.activeTab === id) {
			return {color: 'gray'}
		} else {
			return {color: 'black'}
		}
	}

	render() {
		return this.props.tabs.map((tab) => (
			<Link className="menu-text"
				to={"/cs185-project-react/" + tab.title}
				style={this.addStyling(tab.id)}
				onClick={this.props.changeTab.bind(this, tab.id)}
				key={tab.title}>
					{tab.title}
			</Link>
		));
	}
}

export default TabList;