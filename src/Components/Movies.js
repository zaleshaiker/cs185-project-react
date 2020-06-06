import React, { Component } from 'react';
import Axios from 'axios';
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import 'react-popupbox/dist/react-popupbox.css'; 
import config from '../config';

const firebase = require('firebase');

export class Movies extends Component {
	constructor() {
		super();
		this.state = {
			movies: [],
			moviesToLoad: 6,
			last: '',
			loaded: 0,
			loading: true,
			movieID: '',
			listName: '',
			lists: {},
			movieListPairs: [],
			currentList: {id: '', name: 'All'},
			searchQuery: '',
			graphMovies: []
		};
		this.wrapper = React.createRef();
		this.moviesScroll = React.createRef();
	}

	componentDidMount() {
		if (!firebase.apps.length) {
			firebase.initializeApp(config);
		}

		this.loadMovies();

		let ref = firebase.database().ref('lists');
		ref.orderByChild('name').on('value', snapshot => {
			if (!snapshot.val()) return;
			
			let lists = {};
			
			Object.values(snapshot.val()).forEach(list => {
				lists[list.id] = list.name;
			});

			this.setState({
				lists: lists
			});
		});

		ref = firebase.database().ref('movie-lists');
		ref.orderByKey().on('value', snapshot => {
			if (!snapshot.val()) return;
			
			let movieLists = [];

			Object.values(snapshot.val()).forEach(movieListPair => {
				let pair = Object.entries(movieListPair)[0];
				movieLists.push(pair[0] + ' - ' + pair[1]);
			});

			this.setState({
				movieListPairs: movieLists
			});
		});

		ref = firebase.database().ref('graph');
		ref.on('child_added', snapshot => {
			let movie = snapshot.val();

			let movies = this.state.graphMovies;
			movies.push(movie);

			this.setState({
				'graphMovies': movies
			});
		});
		ref.on('child_removed', snapshot => {
			let movie = snapshot.val();

			let movies = this.state.graphMovies;
			for (let i = 0; i < movies.length; i++) {
				if (movies[i].id === movie.id) {
					movies.splice(i, 1);
					break;
				}
			}

			this.setState({
				'graphMovies': movies
			});
		});

		window.addEventListener("scroll", () => {
			if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
				this.loadMore();
			}
		});
	}

	loadMovies = () => {
		if (this.state.currentList.name === 'All') {
			let ref = firebase.database()
				.ref('movies')
				.orderByChild('title')
				.limitToFirst(this.state.moviesToLoad);
			
			ref.on('child_added', snapshot => {
				let movie = snapshot.val();
				let last = movie.title;
				// console.log(movie);

				let movies = this.state.movies;
				movies.push(movie);

				this.setState({
					'movies': movies,
					'last': last,
					'loaded': this.state.loaded + 1 % this.state.moviesToLoad,
					'loading': this.state.loaded + 1 < this.state.moviesToLoad
				});
			});
		}

		let movieIDs = this.getIDsInList();
		
		movieIDs.forEach(movieID => {
			let ref = firebase.database()
				.ref('movies')
				.orderByChild('id')
				.equalTo(movieID)
				.limitToFirst(1);

			ref.on('child_added', snapshot => {
				let movie = snapshot.val();
				let last = movie.title;
				// console.log(movie);
	
				if (this.state.currentList.name !== 'All') {
					let show = false;
					movieIDs.forEach(movieID => {
						if (movie.id === movieID) show = true;
					});
					if (!show) return;
				}
	
				let movies = this.state.movies;
				movies.push(movie);
	
				this.setState({
					'movies': movies,
					'last': last,
					'loaded': this.state.loaded + 1 % this.state.moviesToLoad,
					'loading': this.state.loaded + 1 < this.state.moviesToLoad
				});
			});
		});
	}

	loadMore = () => {
		if (this.state.loading) return;
		// console.log('load more');
		
		this.setState({
			loading: true,
			loaded: 0
		});
		
		let ref = firebase.database()
			.ref('movies')
			.orderByChild('title')
			.startAt(this.state.last)
			.limitToFirst(this.state.moviesToLoad + 1);

		let movieIDs = [];
		if (this.state.currentList.name !== 'All') movieIDs = this.getIDsInList();

		ref.on('child_added', snapshot => {
			const movie = snapshot.val();

			let duplicate = false;
			this.state.movies.forEach(m => {
				if (m.id === movie.id) duplicate = true;
			});
			if (duplicate) return;

			// console.log(movie);

			if (this.state.currentList.name !== 'All') {
				let show = false;
				movieIDs.forEach(movieID => {
					if (movie.id === movieID) show = true;
				});
				if (!show) return;
			}

			let movies = this.state.movies;
			movies.push(movie);

			let last = movie.title;

			this.setState({
				'movies': movies,
				'last': last,
				'loaded': this.state.loaded + 1 % this.state.moviesToLoad,
				'loading': this.state.loaded + 1 < this.state.moviesToLoad
			});
		});
	}

	addMovie = (event) => {
		event.preventDefault();
		
		if (this.state.movieID.slice(0, 2) !== 'tt' || !/^\d+$/.test(this.state.movieID.slice(2))) {
			const title = this.state.movieID;

			this.setState({
				'movieID': ''
			});

			Axios.get('https://www.omdbapi.com/?apikey=' + process.env.REACT_APP_OMDB_API_KEY + '&t=' + title)
			.then(response => {
				if (response.data.Response === 'False') {
					alert('Movie not found');
					return;
				}

				let duplicate = false;
				this.state.movies.forEach(movie => {
					if (movie.id === response.data.imdbID) duplicate = true;
				});

				if (duplicate) {
					alert('Movie already added');
					return;
				}

				let movie = [];
				movie.id = response.data.imdbID;
				movie.title = response.data.Title;
				movie.director = response.data.Director;
				movie.year = response.data.Year;
				movie.plot = response.data.Plot;
				movie.rating = response.data.imdbRating;
				movie.actors = response.data.Actors.split(', ');

				Axios.get('https://api.themoviedb.org/3/search/movie?api_key=' + process.env.REACT_APP_TMDB_API_KEY + '&language=en-US&query=' + movie.title + '&page=1&year=' + movie.year)
				.then(response => {
					if (response.data.results.length === 0) {
						alert('Movie not found');
						return;
					}

					movie.poster = 'https://image.tmdb.org/t/p/w500' + response.data.results[0].poster_path;

					firebase.database().ref('movies').push().set(movie);

					window.scrollTo({
						top: document.body.scrollHeight,
						behavior: 'smooth'
					});
				});
			});
			
			return;
		}

		const id = this.state.movieID;

		this.setState({
			'movieID': ''
		});
		
		let duplicate = false;
		this.state.movies.forEach(movie => {
			if (movie.id === id) duplicate = true;
		});

		if (duplicate) {
			alert('Movie already added');
			return;
		}


		Axios.get('https://www.omdbapi.com/?apikey=' + process.env.REACT_APP_OMDB_API_KEY + '&i=' + id)
		.then(response => {
			if (response.data.Response === 'False') {
				alert('Movie not found');
				return;
			}

			let movie = [];
			movie.id = id;
			movie.title = response.data.Title;
			movie.director = response.data.Director;
			movie.year = response.data.Year;
			movie.plot = response.data.Plot;
			movie.rating = response.data.imdbRating;
			movie.actors = response.data.Actors.split(', ');

			Axios.get('https://api.themoviedb.org/3/search/movie?api_key=' + process.env.REACT_APP_TMDB_API_KEY +'&language=en-US&query=' + movie.title + '&page=1&year=' + movie.year)
			.then(response => {
				if (response.data.results.length === 0) {
					alert('Movie not found');
					return;
				}

				movie.poster = 'https://image.tmdb.org/t/p/w500' + response.data.results[0].poster_path;

				firebase.database().ref('movies').push().set(movie);

				window.scrollTo({
					top: document.body.scrollHeight,
					behavior: 'smooth'
				});
			});
		});
	}

	addList = (event) => {
		event.preventDefault();
		console.log('addList: ' + this.state.listName);
		
		let listName = this.state.listName;
		
		this.setState({
			'listName': ''
		});

		let duplicate = false;
		Object.entries(this.state.lists).forEach(list => {
			if (listName.toLowerCase() === list[1].toLowerCase()) duplicate = true;
		});
		if (duplicate) {
			alert('List already exists');
			return;
		};
		
		let ref = firebase.database().ref('lists');
		let listRefKey = ref.push().key;
		
		let updates = {};
		updates['/lists/' + listRefKey + '/id'] = listRefKey;
		updates['/lists/' + listRefKey + '/name'] = listName;

		firebase.database().ref().update(updates);
	}

	getUpdateLists = () => {
		return Object.entries(this.state.lists).map(list => (
			<option key={list[0]}
				value={list[0]}>{list[1]}</option>
		));
	}

	getAddToLists = (id) => {
		return Object.entries(this.state.lists).map((list, i) => (
			<option key={list[0]}
				value={list[0]}>{list[1]}</option>
		));
	}

	updateList = (event) => {
		let listName = '';
		if (event.target.value === '') {
			listName = 'All';
		} else {
			listName = this.state.lists[event.target.value];
		}

		this.setState({
			movies: [],
			currentList: {id: event.target.value, name: listName},
			loaded: 0,
			loading: true
		});

		this.forceUpdate(this.loadMovies);
	}

	addToList = (event, movieID) => {
		let listID = event.target.value;
		let duplicate = false;
		this.state.movieListPairs.forEach(movieListPair => {
			let pair = movieListPair.split(' - ');
			if (pair[0] === listID && pair[1] === movieID) duplicate = true;
		});
		if (duplicate) {
			alert('Movie already added to list');
			return;
		};
		
		let ref = firebase.database().ref('movie-lists');
		ref.push().set({[listID]: movieID});

		alert('Movie added to ' + this.state.lists[event.target.value]);
	}

	getIDsInList = () => {
		let movieIDs = [];
		this.state.movieListPairs.forEach(movieListPair => {
			if (movieListPair.search(this.state.currentList.id) > -1) {
				movieIDs.push(movieListPair.slice((this.state.currentList.id + ' - ').length));
			}
		});

		return movieIDs;
	}

	search = (event) => {
		event.preventDefault();
	}

	graphContainsMovie = (id) => {
		let movies = this.state.graphMovies;
		for (let i = 0; i < movies.length; i++) {
			if (movies[i].id === id) return true;
		}
		return false;
	}

	addToGraph = (movie) => {		
		let exists = this.graphContainsMovie(movie.id);

		if (exists) {
			let ref = firebase.database().ref('graph');
			let removeMovie = ref.orderByChild('id').equalTo(movie.id).limitToFirst(1).on('child_added', snapshot => {
				ref.child(snapshot.key).remove();
			});
			ref.off('child_added', removeMovie);
		} else {
			firebase.database().ref('graph').push().set(movie);
		}
		this.displayLightbox(movie);
	}

	deleteMovie = (movieID) => {
		let ref = firebase.database().ref('movies');
		
		let removeMovie = ref.orderByChild('id').equalTo(movieID).limitToFirst(1).on('child_added', snapshot => {
			ref.child(snapshot.key).remove();
		});
		ref.off('child_added', removeMovie);

		let movies = this.state.movies;
		
		let toDelete = -1;
		movies.forEach((movie, i) => {
			if (movie.id === movieID) toDelete = i;
		});
		movies.splice(toDelete, 1);

		this.setState({movies: movies});

		PopupboxManager.close();
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	lockScroll = () => {
		document.body.style.overflow = 'hidden';
	}

	unlockScroll = () => {
		document.body.style.overflow = 'inherit';
	}

	displayMovies = () => {
		return this.state.movies.filter(movie => movie.title.toLowerCase().includes(this.state.searchQuery)).map(movie => (
			<img className="movie" src={movie.poster}
				key={movie.id} alt=""
				onClick={this.displayLightbox.bind(this, movie)}/>
		));
	}

	displayLightbox = (movie) => {
		const content = (
			<div className="movie-lightbox">
				<img className="movie-lightbox-img" src={movie.poster} alt=""/>
				<div>
					<h2>{movie.title}</h2>
					<p className="movie-lightbox-plot">{movie.plot}</p>
					<p className="movie-lightbox-director">Directed by <b>{movie.director}</b></p>
					<p className="movie-lightbox-rating">Rating: <b>{movie.rating}</b></p>
					
					<div>
						<select className="dropdown" value='Add to List' onChange={event => {this.addToList(event, movie.id)}}>
							<option hidden value="">Add to List</option>
							{this.getAddToLists(movie.id)}
						</select>
						<button className="add-to-graph-button" onClick={() => this.addToGraph(movie)}>
							{this.graphContainsMovie(movie.id) ? 'Remove from Graph' : 'Add to Graph'}
						</button>
						<button className="delete-button" onClick={() => {this.deleteMovie(movie.id)}}>Delete</button>
					</div>
				</div>
			</div>
		)

		if (PopupboxManager.show) {
			PopupboxManager.update({content});
		} else {
			PopupboxManager.open({content,
				config: {
					onOpen: this.lockScroll,
					onClosed: this.unlockScroll
				}
			});
		}
	}

	render() {
		const popupboxConfig = {
			style: {
				overflow: 'inherit'
			}
		}

		return (
			<div>
				<h1>Movies</h1>
				
				<div className="movie-forms">
					<div className="movie-add-forms">
						<form className="movie-form" onSubmit={e => this.addMovie(e)}>
							<div>
								<input type="text"
									name="movieID"
									className="form-input-text"
									value={this.state.movieID}
									onChange={e => this.handleChange(e)}
									placeholder="Enter a movie title or IMDB ID"/>
								<span>Add a Movie</span>
							</div>
						</form>

						<form className="movie-form" onSubmit={e => this.addList(e)}>
							<div>
								<input type="text"
									name="listName"
									className="form-input-text"
									value={this.state.listName}
									onChange={e => this.handleChange(e)}
									placeholder="Enter a new list name"/>
								<span>Create a List</span>
							</div>
						</form>
						
						<div className="dropdown">
							<select defaultValue="All" onChange={this.updateList}>
								<option value="">All</option>
								{this.getUpdateLists()}
							</select>
						</div>

					</div>

					<form className="movie-form" onSubmit={e => this.search(e)}>
						<div>
							<input type="text"
								name="searchQuery"
								className="form-input-text"
								value={this.state.searchQuery}
								onChange={e => this.handleChange(e)}
								placeholder="Enter a movie name"/>
							<span>Search</span>
						</div>
					</form>
					<div></div>
				</div>
				
				<div className="movies"
					ref={this.moviesScroll}>
					{this.displayMovies()}

					<PopupboxContainer { ...popupboxConfig } />
				</div>
			</div>

		);
	}
}

export default Movies;