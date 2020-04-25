import React, { Component } from 'react';
import DodgeLogo from '../Images/dodge-logo.png';
import PlanetsLogo from '../Images/planets-logo.png';

export class Projects extends Component {
	render() {
		return (
			<div>
				<h1>Projects</h1>
				<div className="projects">
					<div className="project-container">
						<a href="https://www.kongregate.com/games/ghesebull/dodge">
							<img className="project-img" src={DodgeLogo} alt="Dodge logo"/>
						</a>
						<div>
							<h2>Dodge</h2>
							<p>I developed a game using the Unity Game Engine during summer and have since released it on Kongregate as a free to play game. The game is a simple arcade game where the objective is to earn a high score running away from enemies spawning from all over the screen.</p>
						</div>
					</div>
					
					<div className="project-container">
						<a href="https://github.com/zaleshaiker/Planets">
							<img className="project-img" src={PlanetsLogo} alt="Planets logo"/>
						</a>
						<div>
							<h2>Planets</h2>
							<p>I recreated a puzzle game that I enjoyed called Planets. I created it using Python and the PyGame framework to build the game. The levels are dynamically generated so the game is different every time it is played.</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Projects;