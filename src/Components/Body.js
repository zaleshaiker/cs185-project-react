import React, { Component } from 'react';
import Home from './Home';
import Projects from './Projects';
import Images from './Images';
import Videos from './Videos';
import BackToTop from '../Images/back-to-top.png';

export class Body extends Component {
	constructor() {
		super();
		this.state = {
			backToTopVisible: false
		}
	}
	
	componentDidMount() {
		document.addEventListener('scroll', () => {
			this.setState({
				backToTopVisible: window.pageYOffset > 0
			})
		});
	}

	displayContents = () => {
		var activeTab = this.props.activeTab
		if (activeTab === 0) {
			return <Home/>
		} else if (activeTab === 1) {
			return <Projects/>
		} else if (activeTab === 2) {
			return <Images/>
		} else if (activeTab === 3) {
			return <Videos/>
		}
	}

	backToTopStyle = () => {
		if (this.state.backToTopVisible) {
			return {display: 'block'}
		} else {
			return {display: 'none'}
		}
	}

	moveToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	render() {
		return (
			<div className="body">
				{this.displayContents()}

				<div className="back-to-top"
					style={this.backToTopStyle()}
					onClick={() => {this.moveToTop()}}>
						<img src={BackToTop} alt=""/>
				</div>
			</div>
		);
	}
}

export default Body;