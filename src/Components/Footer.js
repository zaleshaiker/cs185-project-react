import React, { Component } from 'react';

export class Body extends Component {
	render() {
		const divStyle = {
			clear: 'both'
		};
		return (
			<div className="footer">
				<div></div>
				<div className="footer-menu">
					<a className="link-text" href="https://www.github.com/zaleshaiker">Github</a>
					<a className="link-text" href="https://www.linkedin.com/in/zainaleshaiker/">LinkedIn</a>
				</div>
				<div style={divStyle}></div>
			</div>
		);
	}
}

export default Body;