import React, { Component } from 'react';

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
			<p className="menu-text"
				style={this.addStyling(tab.id)}
				onClick={this.props.changeTab.bind(this, tab.id)}>
					{tab.title}
			</p>
		));
	}
}

export default TabList;