import React, { Component } from 'react';

import { withRouter } from "react-router-dom";
import { withTranslation } from 'react-i18next'

import { Alert, Button, Jumbotron, Container } from 'react-bootstrap'


class JoinUs extends Component {

	state = {
		producerJoinEndpoint: this.props.producerJoinEndpoint,
		setRequestedJoin: this.props.setRequestedJoin,
		setAlert: this.props.setAlert,
		requested: false,
		error: null,
	}

	addError = (error) => {
		this.setState({
			error: error,
		})
	}

	joinRequest = () => {
		const { t } = this.props
		const request = {
			method: 'PUT',
			credentials: 'include',
		}

		fetch(this.state.producerJoinEndpoint, request)
		.then(response => response.json())
		.then(data => {
			this.setState({
				requested: data['requested'],
			})

			if (data['requested']) {
				this.state.setAlert(t('joinus.alert'))
				this.state.setRequestedJoin(true)
				this.props.history.push('/search');
			}
		})
		.catch(err => {
			this.addError(t('joinus.error.joinrequestfailed'))
		})
	}

	render() {
		const { t } = this.props
		return (
			<Container className="responsive-text">
				{this.state.error ?
					<Alert variant="danger" onClose={() => this.addError(null)} dismissible>
						{this.state.error}
					</Alert> : null
				}
				<Jumbotron>
					<h1>{t('joinus')}</h1>
					<p>
						{t('joinus.p1')}
					</p>
					<p>
						{t('joinus.p2')}
					</p>
					<p>
						{t('joinus.p3')}
					</p>
					<p>
						<Button size="sm" variant="outline-dark" onClick={this.joinRequest}>Join!</Button>
					</p>
				</Jumbotron>
			</Container>
		)
	}
}

export default withRouter(withTranslation()(JoinUs));