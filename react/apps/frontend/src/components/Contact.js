import React, { Component } from 'react';

import { withTranslation } from 'react-i18next'
import { Col, Container, Row } from 'react-bootstrap'

import '../styles/Contact.css'


class Contact extends Component {

	state = {
		emailContact: this.props.emailContact,
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	render() {
		const { t } = this.props
		const emailLink = "mailto:" + this.props.emailContact

		return (
			<Container>
				<Row className="text-center responsive-text">
					<Col xs="1" sm="2" md="3" xl="4"></Col>
					<Col xs ="10" sm="8" md="6" xl="4">
						<h3>{t('contact.title')}</h3>
					</Col>
					<Col xs="1" sm="2" md="3" xl="4"></Col>
				</Row>
				<br/>

				<Row className="text-center responsive-text">
					<Col xs="1" sm="2" md="3" xl="4"></Col>
					<Col xs ="10" sm="8" md="6" xl="4">
						<p>
							{t('contact.p1')}
						</p>
						<p>
							{t('contact.p2.a')} <a href={emailLink}>{t('contact.p2.b')}</a> {t('contact.p2.c')}
						</p>
						<p>
							<div className="email-box">
								{this.props.emailContact}
							</div>
						</p>
						<p>
							{t('contact.p3')}
						</p>
					</Col>
					<Col xs="1" sm="2" md="3" xl="4"></Col>
				</Row>
				<br/>

			</Container>
		)
	}
}

export default withTranslation()(Contact);