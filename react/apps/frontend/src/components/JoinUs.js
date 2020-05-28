import React, { Component } from 'react';

import { Button, Jumbotron } from 'react-bootstrap'


class JoinUs extends Component {

	state = {
		producerJoinEndpoint: this.props.producerJoinEndpoint,
		setSearchOn: this.props.setSearchOn,
		setRequestedJoin: this.props.setRequestedJoin,
		setAlert: this.props.setAlert,
		requested: false
	}

	joinRequest = () => {
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
				this.state.setAlert(
					"We are processing your request! In the meantime you can continue searching. \
					Visit 'My Account' to check the status of your request"
				)
				this.state.setRequestedJoin(true)
				this.state.setSearchOn()
			}
		})
		.catch(err => console.log(err))
	}

	render() {
		return (
			<section>
				<Jumbotron>
					<h1>Join us!</h1>
					<p>
						Would you like to become an author?
					</p>
					<p>
						Becoming an author means that you can contribute to our cause by adding your own references.
						There are no commitments. You can simply do it the next time you read an awesome historical book!
					</p>
					<p>
						If you feel like this is something interesting, click the button below!
					</p>
					<p>
						<Button size="sm" variant="outline-dark" onClick={this.joinRequest}>Join us</Button>
					</p>
				</Jumbotron>
			</section>
		)
	}
}

export default JoinUs;