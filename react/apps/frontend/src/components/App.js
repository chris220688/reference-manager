import React, { Component } from 'react';

import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next'
import i18n from './i18n';
import { TiThMenu } from "react-icons/ti";
import { MdLanguage } from "react-icons/md";
import {
	Alert, Container, Dropdown, Navbar, Nav
} from 'react-bootstrap'

import { constants } from '../constants/Constants.js'
import logo from '../icons/logo-white.svg'
import '../styles/App.css'

import About from './About'
import Account from './Account'
import Search from './Search'
import Login from './Login'
import References from './References'
import JoinUs from './JoinUs'
import PrivacyPolicy from './PrivacyPolicy'
import Terms from './Terms'
import Contact from './Contact'
import Home from './Home'


class App extends Component {

	state = {
		domainName: constants.domainName,
		producerLoginRedirectEndpoint: constants.producerLoginRedirectEndpoint,
		producerLoginEndpoint: constants.producerLoginEndpoint,
		producerLogoutEndpoint: constants.producerLogoutEndpoint,
		producerLoginCheckEndpoint: constants.producerLoginCheckEndpoint,
		producerInsertEndpoint: constants.producerInsertEndpoint,
		producerEditReferenceEndpoint: constants.producerEditReferenceEndpoint,
		producerDeleteEndpoint: constants.producerDeleteEndpoint,
		producerReferencesEndpoint: constants.producerReferencesEndpoint,
		producerCaregoriesEndpoint: constants.producerCaregoriesEndpoint,
		producerBookmarksEndpoint: constants.producerBookmarksEndpoint,
		producerJoinEndpoint: constants.producerJoinEndpoint,
		producerAccountDetailsEndpoint: constants.producerAccountDetailsEndpoint,
		producerDeleteAccountEndpoint: constants.producerDeleteAccountEndpoint,
		producerRateReferenceEndpoint: constants.producerRateReferenceEndpoint,
		consumerSearchEndpoint: constants.consumerSearchEndpoint,
		emailContact: constants.emailContact,
		serversLocation: constants.serversLocation,
		userLoggedIn: false,
		userData: {},
		userName: null,
		permissions: [],
		isAuthor: false,
		requestedJoin: false,
		alertMessage: null,
		currentLanguage: 'EN',
		error: null,
	}

	componentDidMount() {
		// Set the language if cookie exists
		var language = this.getCookie("language")
		if (language !== "en") {
			this.changeLanguage(language)
		}

		this.authenticate()
	}

	addError = (error) => {
		this.setState({
			error: error,
		})
	}

	setCookie = (cname, cvalue, exdays) => {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	getCookie = (cname) => {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	authenticate = () => {
		const { t } = this.props
		var authToken = (window.location.search.match(/authToken=([^&]+)/) || [])[1]
		var error = (window.location.search.match(/error=([^&]+)/) || [])[1]
		window.history.pushState('object', document.title, "/");

		if (error === "401") {
			// Coming back from a redirect after failing to authenticate
			this.addError(t("app.error.failedtoauthenticate"))
			return
		}

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
		.then(data => {})
		.catch(err => {})
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
				userData: data,
			})
		})
		.catch(err => {})
	}

	logout = () => {
		const request = {
			method: 'GET',
			credentials: 'include'
		}

		fetch(this.state.producerLogoutEndpoint, request)
		.then(response => response.json())
		.then(data => {
			window.location.assign('/')
		})
		.catch(err => {})
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

		// Set language cookie
		this.setCookie("language", lng, 30)

		var currentLanguage
		if (lng === 'en') {
			currentLanguage = 'EN'
		} else if (lng === 'gr') {
			currentLanguage = 'ΕΛ'
		}

		this.setState({
			currentLanguage: currentLanguage
		})
	}

	render() {
		const { t } = this.props

		return (
			<section id="page-container">
				<BrowserRouter>
					<Navbar bg="dark" expand="md" sticky="top">
						<Navbar.Brand>
							<Link to={'/'}>
								<img
									src={logo}
									width="35"
									height="35"
									className="d-inline-block align-top navbar-brand-img"
									alt="React Bootstrap logo"
								/>
							</Link>
						</Navbar.Brand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" style={{"color": "#fff", "borderColor": "#fff"}}><TiThMenu/></Navbar.Toggle>
						<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end custom-nav-items">

							<Nav className="mr-auto">
								{this.state.userLoggedIn ?
									<Link to={'/account'} className="nav-link">{t('myaccount')}</Link> : null
								}
								{this.state.consumerSearchEndpoint ?
									<Link to={'/search'} className="nav-link">{t('search.search')}</Link>  : null
								}
								{this.state.userLoggedIn ?
									<Link to={'/references'} className="nav-link">{t('search.references')}</Link> : null
								}
								{this.state.userLoggedIn && !this.state.isAuthor && !this.state.requestedJoin ?
									<Link to={'/joinus'} className="nav-link">{t('joinus')}</Link> : null
								}
							</Nav>

							<Nav>
								{this.state.userLoggedIn ?
									<Nav.Link onClick={this.logout}>{t('search.logout')}</Nav.Link> :
									<Login producerLoginRedirectEndpoint={this.state.producerLoginRedirectEndpoint}/>
								}

								<Dropdown drop="left" className="language-dropdown">
									<Dropdown.Toggle id="dropdown">
										{this.state.currentLanguage} <MdLanguage/>
									</Dropdown.Toggle>
									<Dropdown.Menu className="language-dropdown">
										<Dropdown.Item onClick={() => this.changeLanguage('en')}>{t('search.language.english')}</Dropdown.Item>
										<Dropdown.Item onClick={() => this.changeLanguage('gr')}>{t('search.language.greek')}</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>

							</Nav>
						</Navbar.Collapse>
					</Navbar>

					<Container className="main-container">
						{this.state.error ?
							<Container className="responsive-text">
								<Alert variant="danger" onClose={() => this.addError(null)} dismissible>
									{this.state.error}
								</Alert>
							</Container> : null
						}

						{this.state.alertMessage ?
							<Container className="responsive-text">
								<Alert variant="success" onClose={() => this.setAlert(null)} dismissible>
									<Alert.Heading>{t('joinus.fantastic')}</Alert.Heading>
										<p>
											{this.state.alertMessage}
										</p>
								</Alert>
							</Container> : null
						}
					</Container>

					<footer id="page-footer">
						<div className="footer-container responsive-text">
							<hr/>
							<Navbar sticky="bottom" className="justify-content-end">
								<Nav>
									<Link to={'/about'} className="nav-link">{t('about')}</Link>
									<Link to={'/contact'} className="nav-link">{t('contact')}</Link>
									<Link to={'/terms'} className="nav-link">{t('terms')}</Link>
									<Link to={'/privacy-policy'} className="nav-link">{t('privacypolicy')}</Link>
								</Nav>
							</Navbar>
						</div>
					</footer>

					<Switch>
						<Route exact path='/' component={Home} />
						<Route path='/account' component={
							() => 	<Account
										producerAccountDetailsEndpoint={this.state.producerAccountDetailsEndpoint}
										producerDeleteAccountEndpoint={this.state.producerDeleteAccountEndpoint}
									/>
							} />
						<Route path='/about' component={About} />
						<Route path='/references' component={
							() => 	<References
										producerInsertEndpoint={this.state.producerInsertEndpoint}
										producerEditReferenceEndpoint={this.state.producerEditReferenceEndpoint}
										producerDeleteEndpoint={this.state.producerDeleteEndpoint}
										producerReferencesEndpoint={this.state.producerReferencesEndpoint}
										producerCaregoriesEndpoint={this.state.producerCaregoriesEndpoint}
										producerBookmarksEndpoint={this.state.producerBookmarksEndpoint}
										isAuthor={this.state.isAuthor}
									/>
							} />
						<Route path='/search' component={
							() => 	<Search
										producerCaregoriesEndpoint={this.state.producerCaregoriesEndpoint}
										producerBookmarksEndpoint={this.state.producerBookmarksEndpoint}
										producerRateReferenceEndpoint={this.state.producerRateReferenceEndpoint}
										consumerSearchEndpoint={this.state.consumerSearchEndpoint}
										userLoggedIn={this.state.userLoggedIn}
										userData={this.state.userData}
									/>
							} />
						<Route path='/joinus' component={
							() => 	<JoinUs
										producerJoinEndpoint={this.state.producerJoinEndpoint}
										setRequestedJoin={this.setRequestedJoin}
										setAlert={this.setAlert}
									/>
							} />
						<Route path='/privacy-policy' component={
							() => 	<PrivacyPolicy
										emailContact={this.state.emailContact}
										domainName={this.state.domainName}
										serversLocation={this.state.serversLocation}
									/>
							} />
						<Route path='/terms' component={
							() => 	<Terms
										emailContact={this.state.emailContact}
										domainName={this.state.domainName}
									/>
							} />
						<Route path='/contact' component={
							() => 	<Contact
										emailContact={this.state.emailContact}
									/>
							} />
					</Switch>
				</BrowserRouter>
			</section>
		);
	}
}

export default withTranslation()(App);