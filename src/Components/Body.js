import React, { Component } from 'react';
import Home from './Home';
import Projects from './Projects';
import Images from './Images';
import Videos from './Videos';
import Guestbook from './Guestbook';
import Movies from './Movies';
import Graph from './Graph';
import BackToTop from '../Images/back-to-top.png';
import { Switch, Route, Redirect } from 'react-router-dom';

export class Body extends Component {
	constructor() {
		super();
		this.state = {
			backToTopVisible: false
		};
	}
	
	componentDidMount() {
		document.addEventListener('scroll', () => {
			this.setState({
				backToTopVisible: window.pageYOffset > 100
			});
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
		} else if (activeTab === 5) {
			return <Movies/>
		} else if (activeTab === 6) {
			return <Graph/>
		}
	}

	routeContents = () => {
		return <Switch>
			<Route path="/" exact>
				<Redirect to="/cs185-project-react/" />
			</Route>
			<Route path="/cs185-project-react/" exact>
				<Home/>
			</Route>
			<Route path="/cs185-project-react/projects">
				<Projects/>
			</Route>
			<Route path="/cs185-project-react/images">
				<Images/>
			</Route>
			<Route path="/cs185-project-react/videos">
				<Videos/>
			</Route>
			<Route path="/cs185-project-react/guestbook">
				<Guestbook/>
			</Route>
			<Route path="/cs185-project-react/movies">
				<Movies/>
			</Route>
			<Route path="/cs185-project-react/graph">
				<Graph/>
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