import React, { Component } from 'react';

import Search from './Search';
import Login from './Login';
import References from './References';

import {
	Button, Container, Form, Navbar,
} from 'react-bootstrap'



class App extends Component {

	state = {
		userLoggedIn: false,
		username: null,
		permissions: [],
		producerLoginRedirectEndpoint: process.env.REACT_APP_PRODUCER_LOGIN_REDIRECT_ENDPOINT,
		producerLoginEndpoint: process.env.REACT_APP_PRODUCER_LOGIN_ENDPOINT,
		producerLoginCheckEndpoint: process.env.REACT_APP_PRODUCER_LOGIN_CHECK_ENDPOINT,
		producerInsertEndpoint: process.env.REACT_APP_PRODUCER_INSERT_ENDPOINT,
		producerReferencesEndpoint: process.env.REACT_APP_PRODUCER_REFERENCES_ENDPOINT,
		referencesOn: false,
	}

	componentDidMount() {
		this.authenticate()
	}

	authenticate = () => {
		var authToken = (window.location.search.match(/authToken=([^&]+)/) || [])[1]
		window.history.pushState('object', document.title, "/");

		if (authToken) {
			// Try to get an access token from the server
			this.getAccessToken(authToken)
		} else {
			// Check user is logged in
			this.checkUserSessionStatus()
		}
	}

	getAccessToken = (authToken) => {
		const request = {
			method: 'GET',
			headers: {
				"Authorization": "Bearer " + authToken
			},
			credentials: 'include'
		}

		fetch(this.state.producerLoginEndpoint, request)
		.then(response => {
			// Check user is logged in
			this.checkUserSessionStatus()
		})
		.then(data => console.log(data))
		.catch(err => console.log(err))
	}

	checkUserSessionStatus = () => {
		const request = {
			method: 'GET',
			credentials: 'include'
		}

		fetch(this.state.producerLoginCheckEndpoint, request)
		.then(response => response.json())
		.then(data => {
			console.log("userLoggedIn: " + data['userLoggedIn'])
			this.setState({
				userLoggedIn: data['userLoggedIn']
			})
		})
		.catch(err => console.log(err))
	}

	openReferences = () => {
		this.setState({
			referencesOn: true
		})
	}

	closeReferences = () => {
		this.setState({
			referencesOn: false
		})
	}

	render() {

		return (
			<section>
				<Navbar bg="light" expand="lg">
					<Navbar.Brand href="/">Reference Manager</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
						{this.state.userLoggedIn ?
							<Button variant="secondary" onClick={this.openReferences}>My References</Button> :
							<Login producerLoginRedirectEndpoint={this.state.producerLoginRedirectEndpoint}/>
						}
					</Navbar.Collapse>
				</Navbar>
				<Container>
					{!this.state.referencesOn ?
						<Search/> : <span></span>
					}

				{this.state.userLoggedIn && this.state.referencesOn ?
					<References
						producerInsertEndpoint={this.state.producerInsertEndpoint}
						producerReferencesEndpoint={this.state.producerReferencesEndpoint}
						closeReferences={this.closeReferences}
					/> : <span></span>
				}
				</Container>
			</section>
		);
	}
}

export default App;