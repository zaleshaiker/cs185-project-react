import React, { Component } from 'react';
import MovieIds from './MovieIds';
import Movie1 from '../Images/Posters/Fight Club.jpeg';
import Movie2 from '../Images/Posters/A Clockwork Orange.jpeg';
import Movie3 from '../Images/Posters/Scarface.jpeg';
import Movie4 from '../Images/Posters/Fear and Loathing in Las Vegas.jpeg';
import Movie5 from '../Images/Posters/La La Land.jpeg';
import Movie6 from '../Images/Posters/Pulp Fiction.jpeg';
import Movie7 from '../Images/Posters/Parasite.jpeg';
import Movie8 from '../Images/Posters/American History X.jpeg';
import Movie9 from '../Images/Posters/The Birds.jpeg';
import Movie10 from '../Images/Posters/The Shining.jpeg';
import Movie11 from '../Images/Posters/American Beauty.jpeg';
import Movie12 from '../Images/Posters/The Graduate.jpeg';
import Axios from 'axios';
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import 'react-popupbox/dist/react-popupbox.css';

export class Movies extends Component {
	constructor() {
		super();
		this.state = {
			movies: []
		};
		this.wrapper = React.createRef();
	}

	componentDidMount() {
		MovieIds.split('\n').map((id, i) => {
			return Axios.get('http://www.omdbapi.com/?apikey=' + process.env.REACT_APP_OMDB_API_KEY + '&i=' + id)
			.then((response) => {
				let movies = this.state.movies;
				movies[i] = response.data

				this.setState({movies});
			});
		});
	}

	getMoviePoster = (index) => {
		if (index + 1 === 1) {
			return Movie1;
		} else if (index + 1 === 2) {
			return Movie2;
		} else if (index + 1 === 3) {
			return Movie3;
		} else if (index + 1 === 4) {
			return Movie4;
		} else if (index + 1 === 5) {
			return Movie5;
		} else if (index + 1 === 6) {
			return Movie6;
		} else if (index + 1 === 7) {
			return Movie7;
		} else if (index + 1 === 8) {
			return Movie8;
		} else if (index + 1 === 9) {
			return Movie9;
		} else if (index + 1 === 10) {
			return Movie10;
		} else if (index + 1 === 11) {
			return Movie11;
		} else if (index + 1 === 12) {
			return Movie12;
		}
	}

	lockScroll = () => {
		console.log('lock')
		document.body.style.overflow = 'hidden'
	}

	unlockScroll = () => {
		console.log('unlock')
		document.body.style.overflow = 'inherit'
	}

	displayMovies = () => {
		return this.state.movies.map((movie, i) => (
			<img className="movie" src={this.getMoviePoster(i)}
				key={movie.Title} alt=""
				onClick={this.displayLightbox.bind(this, movie, i)}/>
		));
	}

	displayLightbox = (movie, i) => {
		const content = (
			<div className="movie-lightbox">
				<img className="movie-lightbox-img" src={this.getMoviePoster(i)} alt=""/>
				<div>
					<h2>{movie.Title}</h2>
					<p className="movie-lightbox-plot">{movie.Plot}</p>
					<p className="movie-lightbox-director">Directed by <b>{movie.Director}</b></p>
					<p className="movie-lightbox-rating">Rating: <b>{movie.imdbRating}</b></p>
				</div>
			</div>
		)

		PopupboxManager.open({content,
			config: {
				onOpen: this.lockScroll,
				onClosed: this.unlockScroll
			}
		});
	}

	render() {
		return (
			<div>
				<h1>Movies</h1>
				<div className="movies">
					{this.displayMovies()}

					<PopupboxContainer />
				</div>
			</div>

		);
	}
}

export default Movies;