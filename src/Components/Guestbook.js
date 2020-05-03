import React, { Component } from 'react';
import config from '../config';

const firebase = require('firebase');

export class Guestbook extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			description: '',
			message: '',
			public: false,
			email: '',
			posts: null
		}
	}

	componentDidMount() {
		if (!firebase.apps.length) {
			firebase.initializeApp(config);
		}

		let ref = firebase.database().ref('posts')

		ref.on('value', snapshot => {
			const posts = snapshot.val()

			if (posts) {
				this.setState({
					'posts': Object.values(posts)
				});
			}
		})
	}

	handleChange = (event) => {
		if (event.target.name === 'public') {
			this.setState({
				'public': event.target.value === 'yes'
			});
			return;
		}
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	sendMessage = (event) => {
		event.preventDefault();
		
		const post = {
			name: this.state.name,
			description: this.state.description,
			message: this.state.message,
			public: this.state.public,
			email: this.state.email,
			datetime: new Date()
		}

		if (post.name.length <= 5 || post.name.length >= 20) {
			alert('Error: Name needs to be longer than 5 characters and less than 20 characters');
			return;
		}

		if (post.description.length >= 100) {
			alert('Error: Description needs to be less than 100 characters')
			return;
		}

		if (post.message.length <= 15 || post.message.length >= 500) {
			alert('Error: Message needs to be longer than 15 characters and less than 500 characters');
			return;
		}

		firebase.database().ref('posts').push().set(post);
		alert('You successfully sent your message!');
	}

	getPosts() {
		if (!this.state.posts) return;

		return this.state.posts.map((post) => (
			<div className="post-container">
				<h3>{post.name}</h3>
				<h4>{post.description}</h4>
				<p>{post.message}</p>
				<p>{post.datetime}</p>
			</div>
		));
	}

	render() {
		return (
			<div>
				<h1>Guestbook</h1>
				<div className="guestbook">
					<div className="input-form">
						<form className="guestbook-form" onSubmit={this.sendMessage}>
							<h1 className="form-title">Let's talk!</h1>

							<div className="form-name">
								<input type="text" name="name" className="form-input-text" onChange={e => this.handleChange(e)} required/>
								<span>What is your name?</span>
							</div>

							<div className="form-description">
								<input type="text" name="description" className="form-input-text" onChange={e => this.handleChange(e)} placeholder=" "/>
								<span>Briefly describe yourself</span>
							</div>

							<div className="form-message">
								<textarea name="message" rows="3" onChange={e => this.handleChange(e)} required/>
								<span>What would you like to say?</span>
							</div>

							<div className="form-toggle">
								<p>Would you like your message to be public?</p>
								<label className="toggle-label">Yes
									<input type="radio" id="toggle-one" name="public" className="toggle-input" onChange={e => this.handleChange(e)} value="yes"/>
									<span className="toggle-design"></span>
								</label>
								<label className="toggle-label">No
									<input type="radio" id="toggle-two" name="public" className="toggle-input" onChange={e => this.handleChange(e)} value="no" defaultChecked/>
									<span className="toggle-design"></span>
								</label>
							</div>

							<div className="form-email">
								<input type="text" name="email" className="form-input-text" onChange={e => this.handleChange(e)} placeholder=" "/>
								<span>What is your email?</span>
							</div>

							<div className="form-submit">
								<button>Send Message</button>
							</div>
						</form>
					</div>
					<div className="message-board">
						{this.getPosts()}
					</div>
				</div>
			</div>
		);
	}
}

export default Guestbook;