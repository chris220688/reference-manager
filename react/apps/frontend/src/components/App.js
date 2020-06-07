import React, { Component } from 'react';

import { withTranslation } from 'react-i18next'
import i18n from './i18n';
import { MdLanguage } from "react-icons/md";
import {
	Alert, Container, Dropdown, DropdownType, Navbar, Nav
} from 'react-bootstrap'


import About from './About';
import Search from './Search';
import Login from './Login';
import References from './References';
import JoinUs from './JoinUs';

import '../styles/App.css'


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
		producerCaregoriesEndpoint: process.env.REACT_APP_PRODUCER_CATEGORIES_ENDPOINT,
		producerJoinEndpoint: process.env.REACT_APP_PRODUCER_JOIN_ENDPOINT,
		searchOn: true,
		referencesOn: false,
		joinUsOn: false,
		aboutOn: false,
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
			aboutOn: false,
		})
	}

	openSearch = () => {
		this.setState({
			referencesOn: false,
			searchOn: true,
			joinUsOn: false,
			aboutOn: false,
		})
	}

	openJoinus = () => {
		this.setState({
			referencesOn: false,
			searchOn: false,
			joinUsOn: true,
			aboutOn: false,
		})
	}

	openAbout = () => {
		this.setState({
			referencesOn: false,
			searchOn: false,
			joinUsOn: false,
			aboutOn: true
		})
	}

	setSearchOn = () => {
		this.setState({
			referencesOn: false,
			searchOn: true,
			joinUsOn: false,
			aboutOn: false
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

	changeLanguage = (lng) => {
		i18n.changeLanguage(lng)
	}

	render() {
		const { t } = this.props

		return (
			<section>
				<Navbar bg="dark" expand="md">
					<Navbar.Brand href="#" onClick={this.openSearch}>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end custom-nav-items">

						<Nav className="mr-auto">
							{/*
							{this.state.userName ?
								<span>Hello {this.state.userName}</span> : <span></span>
							}
							*/}
							{this.state.userLoggedIn ?
								<Nav.Link onClick={this.openSearch}>{t('myaccount')}</Nav.Link> : null
							}
							<Nav.Link onClick={this.openSearch}>{t('search.search')}</Nav.Link>
							{this.state.userLoggedIn && this.state.isAuthor ?
								<Nav.Link style={{color:"white"}} onClick={this.openReferences}>{t('search.references')}</Nav.Link> : null
							}
							{this.state.userLoggedIn && !this.state.isAuthor && !this.state.requestedJoin ?
								<Nav.Link onClick={this.openJoinus}>{t('joinus')}</Nav.Link> : null
							}
						</Nav>

						<Nav>
							{this.state.userLoggedIn ?
								<Nav.Link onClick={this.logout}>{t('search.logout')}</Nav.Link> :
								<Login producerLoginRedirectEndpoint={this.state.producerLoginRedirectEndpoint}/>
							}
							<Nav.Link style={{color:"white"}} onClick={() => this.changeLanguage}>
								<Dropdown drop="left" className="language-dropdown">
									<Dropdown.Toggle style={{"BackgroundColor": "black"}} id="dropdown">
										<MdLanguage/>
									</Dropdown.Toggle>
									<Dropdown.Menu className="language-dropdown">
										<Dropdown.Item onClick={() => this.changeLanguage('en')}>{t('search.language.english')}</Dropdown.Item>
										<Dropdown.Item onClick={() => this.changeLanguage('gr')}>{t('search.language.greek')}</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<br/>
				<Container className="search-container">
					{this.state.alertMessage ?
						<Alert variant="success" onClose={() => this.setAlert(null)} dismissible>
							<Alert.Heading>{t('joinus.fantastic')}</Alert.Heading>
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
							producerCaregoriesEndpoint={this.state.producerCaregoriesEndpoint}
						/> : null
					}
					{this.state.aboutOn ?
						<About/> : null
					}
				</Container>

				<Container className="footer-container">
					<hr/>
					<Navbar sticky="bottom" className="justify-content-end">
						<Nav>
							<Nav.Link onClick={this.openAbout}>{t('about')}</Nav.Link>
							<Nav.Link>{t('contact')}</Nav.Link>
							<Nav.Link>{t('terms')}</Nav.Link>
						</Nav>
					</Navbar>
				</Container>
			</section>
		);
	}
}

export default withTranslation()(App);