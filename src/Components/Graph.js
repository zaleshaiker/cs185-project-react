import React, { Component } from 'react';
import * as d3 from 'd3';
import config from '../config';

const firebase = require('firebase');

export class Graph extends Component {
	constructor() {
		super();
		this.state = {
			nodes: {
				movies: [],
				actors: []
			},
			links: []
		}
		this.graph = React.createRef();
	}

	componentDidMount() {
		if (!firebase.apps.length) {
			firebase.initializeApp(config);
		}

		let movieNodes = [];
		let actorNodes = [];
		let links = [];

		let ref = firebase.database().ref('graph');
		ref.on('value', snapshot => {
			if (!snapshot.val()) return;

			let movies = snapshot.val();

			let moviesLength = Object.values(movies).length;
			Object.values(movies).forEach(movie => {
				movie.type = 'movie';
				
				movieNodes.push(movie);

				console.log(movie);
				movie.actors.forEach(actor => {
					let exists = false;
					let actorIndex = -1;
					for (let i = 0; i < actorNodes.length; i++) {
						let n =  actorNodes[i];
												
						if (n.name === actor) {
							exists = true;
							actorIndex = i;
							break;
						}
					}
	
					let link = {};
					if (exists) {
						link = {
							source: movieNodes.length - 1,
							target: moviesLength + actorIndex,
						};
					} else {
						let node = {
							name: actor,
							type: 'actor'
						};
						actorNodes.push(node);
						
						link = {
							source: movieNodes.length - 1,
							target: moviesLength + actorNodes.length - 1,
						};
					}
	
					links.push(link);
				});
			});

			movieNodes = this.state.nodes.movies.concat(movieNodes);
			actorNodes = this.state.nodes.actors.concat(actorNodes);
			links = this.state.links.concat(links);
	
			this.setState({
				'nodes': {
					'movies': movieNodes,
					'actors': actorNodes
				},
				'links': links
			}, this.loadGraph);
		});

	}
	
	loadGraph = () => {
		let element = document.getElementById('graph');
		element.appendChild(this.createGraph());
	}

	drag = (simulation) => {
		function dragStarted(d) {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(d) {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		}

		function dragEnded(d) {
			if (!d3.event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}

		return d3.drag()
			.on('start', dragStarted)
			.on('drag', dragged)
			.on('end', dragEnded);
	}

	createGraph = () => {
		let width = 1920;
		let height = 1080;

		let allNodes = this.state.nodes.movies.concat(this.state.nodes.actors);
		let movieNodes = this.state.nodes.movies;
		let links = this.state.links;

		let svg = d3.create('svg')
			.attr('viewBox', [0, 0, width, height]);
		
		let simulation = d3.forceSimulation(allNodes)
			.force('link', d3.forceLink().links(links).id(d => { return d.index; }).distance(200))
			.force('repel', d3.forceManyBody().distanceMin(100).distanceMax(500).strength(-300))
			.force('attract', d3.forceManyBody().distanceMin(300).distanceMax(1000).strength(100))
			.force('center', d3.forceCenter(width / 2, height / 2));

		let link = svg.append('g')
			.attr('stroke', '#999')
			.attr('stroke-opacity', 0.6)
			.selectAll('line')
			.data(links)
			.join('line')
			.attr('stroke-width', 2);

		let radius = (node) => {
			if (node.type === 'movie')
				return 100;
			return 20;
		}

		let fill = (node) => {
			if (node.type === 'movie')
				return 'url(#' + node.title.replace(/[ ']/g, '_') + '-' + node.year + ')';
			return d3.color('steelblue');
		}
		
		let hovering = false;
		let hoverId = '';
		let hoverNode = null;
		
		let handleMouseOver = (d, i) => {
			svg.append('text')
				.attr('id', 'text-' + i)
				.style('text-anchor', 'middle')
				.attr('x', () => d.x)
				.attr('y', () => d.y + 50)
				.text(d.name);
			
			hovering = true;
			hoverId = 'text-' + i;
			hoverNode = d;
		}

		let handleMouseOut = (d, i) => {
			d3.select('#text-' + i).remove();

			hovering = false;
		}
		
		let defs = svg.append('defs');

		movieNodes.forEach(movieNode => {
			defs.append('pattern')
				.attr('id', movieNode.title.replace(/[ ']/g, '_') + '-' + movieNode.year)
				.attr('width', 1)
				.attr('height', 1)
				.attr('x', 0)
				.attr('y', 0)
				.append('image')
				.attr('xlink:href', movieNode.poster)
				.attr('width', 300)
				.attr('height', 300)
				.attr('x', -50)
				.attr('y', -50);
		});

		let node = svg.append('g')
			.attr('stroke', '#fff')
			.attr('stroke-width', 1.5)
			.selectAll('circle')
			.data(allNodes)
			.join('circle')
			.attr('r', radius)
			.attr('fill', fill)
			.on('mouseover', handleMouseOver)
			.on('mouseout', handleMouseOut)
			.call(this.drag(simulation));
		
		simulation.on('tick', () => {
			link.attr('x1', d => d.source.x)
				.attr('y1', d => d.source.y)
				.attr('x2', d => d.target.x)
				.attr('y2', d => d.target.y);

			node.attr('cx', d => d.x)
				.attr('cy', d => d.y);

			if (hovering) {
				d3.select('#' + hoverId)
					.attr('x', () => hoverNode.x)
					.attr('y', () => hoverNode.y + 50);
			}
		});

		return svg.node();
	}
	
	render() {
		return (
			<div id="graph">
			</div>
		);
	}
}

export default Graph;