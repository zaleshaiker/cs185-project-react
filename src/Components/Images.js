import React, { Component } from 'react';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox';
import Image1 from '../Images/img-1.jpg';
import Image2 from '../Images/img-2.jpg';
import Image3 from '../Images/img-3.jpg';
import Image4 from '../Images/img-4.jpg';
import Image5 from '../Images/img-5.jpg';
import Image6 from '../Images/img-6.jpg';

export class Images extends Component {
	render() {
		return (
			<div>
				<SimpleReactLightbox>
					<h1>Images</h1>
					<div className="images">
						<SRLWrapper>
							<img className="image" src={Image1} alt=""/>
							<img className="image" src={Image2} alt=""/>
							<img className="image" src={Image3} alt=""/>
							<img className="image" src={Image4} alt=""/>
							<img className="image" src={Image5} alt=""/>
							<img className="image" src={Image6} alt=""/>
						</SRLWrapper>
					</div>
				</SimpleReactLightbox>
			</div>

		);
	}
}

export default Images;