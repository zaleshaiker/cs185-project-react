import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header';
import Body from './Components/Body';
import Footer from './Components/Footer';

export class App extends Component {
	constructor() {
		super();
		this.state = {
			activeTab: 0
		}
		this.changeTab = (id) => {
			this.setState({
				activeTab: id
			})
		}
	}

	render() {
		const tabs = [
			{
				id: 1,
				title: 'Projects'
			},
			{
				id: 2,
				title: 'Images'
			},
			{
				id: 3,
				title: 'Videos'
			},
			{
				id: 4,
				title: 'Guestbook'
			},
			{
				id: 5,
				title: 'Movies'
			},
			{
				id: 6,
				title: 'Graph'
			}
		]
		return (
			<div className="page-container">
				<Header tabs={tabs}
					activeTab={this.state.activeTab}
					changeTab={this.changeTab}/>
				
				<Body/>
				
				<Footer/>
			</div>
		);
	}
}

export default App;
