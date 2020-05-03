import React, { Component } from 'react';
import Home from './Home';
import Projects from './Projects';
import Images from './Images';
import Videos from './Videos';
import Guestbook from './Guestbook';
import BackToTop from '../Images/back-to-top.png';
import { Switch, Route } from 'react-router-dom';

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
				backToTopVisible: window.pageYOffset > 100
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
		} else if (activeTab === 4) {
			return <Guestbook/>
		}
	}

	routeContents = () => {
		return <Switch>
			<Route path="/" exact>
				<Home/>
			</Route>
			<Route path="/projects">
				<Projects/>
			</Route>
			<Route path="/images">
				<Images/>
			</Route>
			<Route path="/videos">
				<Videos/>
			</Route>
			<Route path="/guestbook">
				<Guestbook/>
			</Route>
		</Switch>
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
				{this.routeContents()}

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