import React, { Component } from 'react';

import { withTranslation } from 'react-i18next'

import {
	Col, Container, Row
} from 'react-bootstrap'

import '../styles/About.css'


class About extends Component {

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	render() {
		const { t } = this.props
		return (
			<Container className="text-center responsive-text" style={{"marginTop": "20px"}}>
				<Row>
					<Col sm="1"></Col>
					<Col sm ="10">
						<h4>{t('about.vision')}</h4>
						<p>{t('about.vision.p1')}</p>
						<p>{t('about.vision.p2')}</p>
						<p>{t('about.vision.p3')}</p>
						<p>{t('about.vision.p4')}</p>
						<div className="quote-box">
							<p><i><b>{t('about.vision.p5')}</b></i></p>
						</div>
						<p>{t('about.vision.p6')}</p>
					</Col>
					<Col sm="1"></Col>
				</Row>
				<br/>
				<Row>
					<Col sm="1"></Col>
					<Col sm ="10">
						<h4>{t('about.whoweare')}</h4>
						<p>{t('about.whoweare.p1')}</p>
						<p>{t('about.whoweare.p2')}</p>
					</Col>
					<Col sm="1"></Col>
				</Row>
				<br/>
				<Row>
					<Col sm="1"></Col>
					<Col sm ="10">
						<h4>{t('about.contribute')}</h4>
						<p>{t('about.contribute.p1')}</p>
						<p>{t('about.contribute.p2')}</p>
					</Col>
					<Col sm="1"></Col>
				</Row>
			</Container>
		)
	}
}

export default withTranslation()(About);