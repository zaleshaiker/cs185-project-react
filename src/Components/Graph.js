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
			console.log(moviesLength);
			Object.values(movies).forEach(movie => {
				movie.type = 'movie';
				
				movieNodes.push(movie);

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
							value: 100
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
							value: 50
						};
					}
	
					links.push(link);
				});
			});

			movieNodes = this.state.nodes.movies.concat(movieNodes);
			actorNodes = this.state.nodes.actors.concat(actorNodes);
			links = this.state.links.concat(links);

			console.log(movieNodes.concat(actorNodes));
			console.log(links);
	
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

		let nodes = this.state.nodes.movies.concat(this.state.nodes.actors);
		let objNodes = nodes.map(d => Object.create(d));
		let objLinks = this.state.links.map(d => Object.create(d));

		let svg = d3.create('svg')
			.attr('viewBox', [0, 0, width, height]);
		
		let simulation = d3.forceSimulation(objNodes)
			.force('link', d3.forceLink().links(this.state.links).id(d => { console.log(d); return d.index; }).distance(200))
			.force('link2', d3.forceLink().links(this.state.links).id(d => { if (d.type === 'actor') return d.index; }).distance(400))
			.force('repel', d3.forceManyBody().distanceMin(100).distanceMax(500).strength(-300))
			.force('attract', d3.forceManyBody().distanceMin(300).distanceMax(1000).strength(100))
			.force('center', d3.forceCenter(width / 2, height / 2));

		let radius = (node) => {
			if (node.type === 'movie')
				return 100;
			return 50;
		}

		let fill = (node) => {
			if (node.type === 'movie')
				return d3.color('black');
			return d3.color('steelblue');
		}
		
		let link = svg.append('g')
			.attr('stroke', '#999')
			.attr('stroke-opacity', 0.6)
			.selectAll('line')
			.data(objLinks)
			.join('line')
			.attr('stroke-width', d => Math.sqrt(d.value));

		let node = svg.append('g')
			.attr('stroke', '#fff')
			.attr('stroke-width', 1.5)
			.selectAll('circle')
			.data(objNodes)
			.join('circle')
			.attr('r', radius)
			.attr('fill', fill)
			.call(this.drag(simulation));
		
		node.select(function(d) {
				if (d.type === 'movie') {
					console.log(d);
					return this;
				}
			})
			.append('image')
			.attr('xlink:href', d => d.poster)
			.attr('x', -50)
			.attr('y', -50)
			.attr('width', 100)
			.attr('height', 100)
			// .call(this.drag(simulation));
		
		let hovering = false;
		let hoverId = '';
		let hoverNode = null;
		
		let handleMouseOver = (d, i) => {
			svg.append('text')
				.attr('id', 'text-' + i)
				.style('text-anchor', 'middle')
				.attr('x', () => d.x)
				.attr('y', () => d.y + 75)
				.text(d.name);
			
			hovering = true;
			hoverId = 'text-' + i;
			hoverNode = d;
		}

		let handleMouseOut = (d, i) => {
			d3.select('#text-' + i).remove();

			hovering = false;
		}

		node.select(function(d) {
				if (d.type === 'actor') {
					return this;
				}
			})
			// .join('circle')
			// .attr('r', 50)
			// .attr('fill', 'steelblue')
			.on('mouseover', handleMouseOver)
			.on('mouseout', handleMouseOut)
			// .call(this.drag(simulation));

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
					.attr('y', () => hoverNode.y + 75);
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