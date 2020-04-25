import React, { Component } from 'react';

export class Videos extends Component {
	render() {
		return (
			<div>
				<h1>Videos</h1>
				<div className="videos">
					<iframe className="video" width="640" height="480" src="https://www.youtube.com/embed/fnl4yAdkYXM" title="My Sweet Lord - George Harrison Cover">
					</iframe>
				</div>
			</div>
		);
	}
}

export default Videos;