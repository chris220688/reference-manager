import React, { Component } from 'react';

import Search from './Search';
import Login from './Login';
import References from './References';
import JoinUs from './JoinUs';

import logo from '../icons/logo.png'


import {
	Alert, Button, Container, Navbar, Nav,
} from 'react-bootstrap'



class App extends Component {

	state = {
		userLoggedIn: false,
		userName: null,
		permissions: [],
		producerLoginRedirectEndpoint: process.env.REACT_APP_PRODUCER_LOGIN_REDIRECT_ENDPOINT,
		producerLoginEndpoint: process.env.REACT_APP_PRODUCER_LOGIN_ENDPOINT,
		producerLogoutEndpoint: process.env.REACT_APP_PRODUCER_LOGOUT_ENDPOINT,
		producerLoginCheckEndpoint: process.env.REACT_APP_PRODUCER_LOGIN_CHECK_ENDPOINT,
		producerInsertEndpoint: process.env.REACT_APP_PRODUCER_INSERT_ENDPOINT,
		producerDeleteEndpoint: process.env.REACT_APP_PRODUCER_DELETE_ENDPOINT,
		producerReferencesEndpoint: process.env.REACT_APP_PRODUCER_REFERENCES_ENDPOINT,
		producerJoinEndpoint: process.env.REACT_APP_PRODUCER_JOIN_ENDPOINT,
		searchOn: true,
		referencesOn: false,
		joinUsOn: false,
		isAuthor: false,
		requestedJoin: false,
		alertMessage: null,
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
			this.setState({
				userLoggedIn: data['userLoggedIn'],
				userName: data['userName'],
				isAuthor: data['isAuthor'],
				requestedJoin: data['requestedJoin'],
			})
		})
		.catch(err => console.log(err))
	}

	logout = () => {
		const request = {
			method: 'GET',
			credentials: 'include'
		}

		fetch(this.state.producerLogoutEndpoint, request)
		.then(response => response.json())
		.then(data => {
			this.setState({
				userLoggedIn: data['userLoggedIn'],
				userName: null,
				isAuthor: null,
				requestedJoin: null,
			})
		})
		.catch(err => console.log(err))
	}

	openReferences = () => {
		this.setState({
			referencesOn: true,
			searchOn: false,
			joinUsOn: false,
		})
	}

	openSearch = () => {
		this.setState({
			referencesOn: false,
			searchOn: true,
			joinUsOn: false,
		})
	}

	openJoinus = () => {
		this.setState({
			referencesOn: false,
			searchOn: false,
			joinUsOn: true,
		})
	}

	setSearchOn = () => {
		this.setState({
			searchOn: true,
			joinUsOn: false,
		})
	}

	setRequestedJoin = (requestedJoin) => {
		this.setState({
			requestedJoin: requestedJoin,
		})
	}

	setAlert = (alertMessage) => {
		this.setState({
			alertMessage: alertMessage,
		})
	}

	render() {
		return (
			<section>
				<Navbar bg="light" expand="lg">
					<Navbar.Brand href="#" onClick={this.openSearch}>
						<img alt="" src={logo} width="30" height="30" className="d-inline-block align-top"/>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
						<Nav className="mr-auto">
							<Nav.Link>About</Nav.Link>
							<Nav.Link>Contact us</Nav.Link>
						</Nav>
						{this.state.userLoggedIn ?
							<Nav className="mr-auto">
								{/*
								{this.state.userName ?
									<span>Hello {this.state.userName}</span> : <span></span>
								}
								*/}
								<Nav.Link onClick={this.openSearch}>My Account</Nav.Link>
								<Nav.Link onClick={this.openSearch}>Search</Nav.Link>
								{this.state.isAuthor ?
									<Nav.Link onClick={this.openReferences}>References</Nav.Link> : null
								}
								{!this.state.isAuthor && !this.state.requestedJoin ?
									<Nav.Link onClick={this.openJoinus}>Join us</Nav.Link> : null
								}

							</Nav> : null
						}
						<Nav>
							{this.state.userLoggedIn ?
								<Nav.Link onClick={this.logout}>Log out</Nav.Link> :
								<Login producerLoginRedirectEndpoint={this.state.producerLoginRedirectEndpoint}/>
							}
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<br/>
				<Container>
					{this.state.alertMessage ?
						<Alert variant="success" onClose={() => this.setAlert(null)} dismissible>
							<Alert.Heading>Fantastic!</Alert.Heading>
								<p>
									{this.state.alertMessage}
								</p>
						</Alert> : null
					}
					{this.state.searchOn ?
						<Search/> : null
					}
					{this.state.userLoggedIn && !this.state.isAuthor && this.state.joinUsOn ?
						<JoinUs
							producerJoinEndpoint={this.state.producerJoinEndpoint}
							setSearchOn={this.setSearchOn}
							setRequestedJoin={this.setRequestedJoin}
							setAlert={this.setAlert}
						/> : null
					}
					{this.state.userLoggedIn && this.state.referencesOn ?
						<References
							producerInsertEndpoint={this.state.producerInsertEndpoint}
							producerDeleteEndpoint={this.state.producerDeleteEndpoint}
							producerReferencesEndpoint={this.state.producerReferencesEndpoint}
						/> : null
					}
				</Container>
			</section>
		);
	}
}

export default App;