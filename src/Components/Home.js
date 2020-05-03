import React, { Component } from 'react';
import BeachImage from '../Images/beach.jpg';

export class Home extends Component {
	render() {
		return (
			<div className="body-home">
				<div>
					<img src={BeachImage} alt="Beach in Isla Vista"/>
				</div>
				<div>
					<h1 className="home-body">
						Zain Aleshaiker is a<br/>Computer Science major<br/>at UCSB.
					</h1>
				</div>
			</div>
		);
	}
}

export default Home;