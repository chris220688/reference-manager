import React, { Component } from 'react';

import { withTranslation } from 'react-i18next'

import { Button, Jumbotron, Container } from 'react-bootstrap'


class JoinUs extends Component {

	state = {
		producerJoinEndpoint: this.props.producerJoinEndpoint,
		setSearchOn: this.props.setSearchOn,
		setRequestedJoin: this.props.setRequestedJoin,
		setAlert: this.props.setAlert,
		requested: false
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
				this.state.setSearchOn()
			}
		})
		.catch(err => console.log(err))
	}

	render() {
		const { t } = this.props
		return (
			<Container className="responsive-text">
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

export default withTranslation()(JoinUs);