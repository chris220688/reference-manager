import React, { Suspense, Component, lazy } from 'react';

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

// Lazy load components
const About = lazy(() => import('./About'));
const Account = lazy(() => import('./Account'));
const Search = lazy(() => import('./Search'));
const Login = lazy(() => import('./Login'));
const References = lazy(() => import('./References'));
const JoinUs = lazy(() => import('./JoinUs'));
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'));
const Terms = lazy(() => import('./Terms'));
const Contact = lazy(() => import('./Contact'));
const Home = lazy(() => import('./Home'));


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
		homeOn: true,
		searchOn: false,
		accountOn: false,
		referencesOn: false,
		joinUsOn: false,
		aboutOn: false,
		privacyPolicyOn: false,
		termsOn: false,
		contactOn: false,
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
		.then(data => {window.location.reload()})
		.catch(err => {})
	}

	openReferences = () => {
		this.setState({
			referencesOn: true,
			homeOn: false,
			accountOn: false,
			searchOn: false,
			joinUsOn: false,
			aboutOn: false,
			privacyPolicyOn: false,
			termsOn: false,
			contactOn: false,
		})
	}

	openSearch = () => {
		this.setState({
			referencesOn: false,
			homeOn: false,
			accountOn: false,
			searchOn: true,
			joinUsOn: false,
			aboutOn: false,
			privacyPolicyOn: false,
			termsOn: false,
			contactOn: false,
		})
	}

	openAccount = () => {
		this.setState({
			referencesOn: false,
			homeOn: false,
			accountOn: true,
			searchOn: false,
			joinUsOn: false,
			aboutOn: false,
			privacyPolicyOn: false,
			termsOn: false,
			contactOn: false,
		})
	}

	openJoinus = () => {
		this.setState({
			referencesOn: false,
			homeOn: false,
			accountOn: false,
			searchOn: false,
			joinUsOn: true,
			aboutOn: false,
			privacyPolicyOn: false,
			termsOn: false,
			contactOn: false,
		})
	}

	openAbout = () => {
		this.setState({
			referencesOn: false,
			homeOn: false,
			accountOn: false,
			searchOn: false,
			joinUsOn: false,
			aboutOn: true,
			privacyPolicyOn: false,
			termsOn: false,
			contactOn: false,
		})
	}

	openPrivacyPolicy = () => {
		this.setState({
			referencesOn: false,
			homeOn: false,
			accountOn: false,
			searchOn: false,
			joinUsOn: false,
			aboutOn: false,
			privacyPolicyOn: true,
			termsOn: false,
			contactOn: false,
		})
	}

	openTerms = () => {
		this.setState({
			referencesOn: false,
			homeOn: false,
			accountOn: false,
			searchOn: false,
			joinUsOn: false,
			aboutOn: false,
			privacyPolicyOn: false,
			termsOn: true,
			contactOn: false,
		})
	}

	openContact = () => {
		this.setState({
			referencesOn: false,
			homeOn: false,
			accountOn: false,
			searchOn: false,
			joinUsOn: false,
			aboutOn: false,
			privacyPolicyOn: false,
			termsOn: false,
			contactOn: true,
		})
	}

	setSearchOn = () => {
		this.setState({
			referencesOn: false,
			homeOn: false,
			accountOn: false,
			searchOn: true,
			joinUsOn: false,
			aboutOn: false,
			privacyPolicyOn: false,
			termsOn: false,
			contactOn: false,
		})
	}

	openHome = () => {
		this.setState({
			referencesOn: false,
			homeOn: true,
			accountOn: false,
			searchOn: false,
			joinUsOn: false,
			aboutOn: false,
			privacyPolicyOn: false,
			termsOn: false,
			contactOn: false,
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
				<div id="content-wrap">
					<Navbar bg="dark" expand="md" sticky="top">
						<Navbar.Brand onClick={this.openHome}>
							<img
								src={logo}
								width="35"
								height="35"
								className="d-inline-block align-top navbar-brand-img"
								alt="React Bootstrap logo"
							/>
						</Navbar.Brand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" style={{"color": "#fff", "borderColor": "#fff"}}><TiThMenu/></Navbar.Toggle>
						<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end custom-nav-items">

							<Nav className="mr-auto">
								{this.state.userLoggedIn ?
									<Nav.Link onClick={this.openAccount}>{t('myaccount')}</Nav.Link> : null
								}
								<Nav.Link onClick={this.openSearch}>{t('search.search')}</Nav.Link>
								{this.state.userLoggedIn ?
									<Nav.Link style={{color:"white"}} onClick={this.openReferences}>{t('search.references')}</Nav.Link> : null
								}
								{this.state.userLoggedIn && !this.state.isAuthor && !this.state.requestedJoin ?
									<Nav.Link onClick={this.openJoinus}>{t('joinus')}</Nav.Link> : null
								}

							</Nav>

							<Nav>
								{this.state.userLoggedIn ?
									<Nav.Link onClick={this.logout}>{t('search.logout')}</Nav.Link> :
									<Suspense fallback={null}>
										<Login producerLoginRedirectEndpoint={this.state.producerLoginRedirectEndpoint}/>
									</Suspense>
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

					{this.state.homeOn ?
						<Suspense fallback={null}>
							<Home/>
						</Suspense> : null
					}

					<br/>
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
						{this.state.accountOn ?
							<Suspense fallback={null}>
								<Account
									producerAccountDetailsEndpoint={this.state.producerAccountDetailsEndpoint}
									producerDeleteAccountEndpoint={this.state.producerDeleteAccountEndpoint}
								/>
							</Suspense> : null
						}
						{this.state.searchOn && this.state.consumerSearchEndpoint ?
							<Suspense fallback={null}>
								<Search
									producerCaregoriesEndpoint={this.state.producerCaregoriesEndpoint}
									producerBookmarksEndpoint={this.state.producerBookmarksEndpoint}
									producerRateReferenceEndpoint={this.state.producerRateReferenceEndpoint}
									consumerSearchEndpoint={this.state.consumerSearchEndpoint}
									userLoggedIn={this.state.userLoggedIn}
									userData={this.state.userData}
								/>
							</Suspense> : null
						}
						{this.state.userLoggedIn && !this.state.isAuthor && this.state.joinUsOn ?
							<Suspense fallback={null}>
								<JoinUs
									producerJoinEndpoint={this.state.producerJoinEndpoint}
									setSearchOn={this.setSearchOn}
									setRequestedJoin={this.setRequestedJoin}
									setAlert={this.setAlert}
								/>
							</Suspense> : null
						}
						{this.state.userLoggedIn && this.state.referencesOn ?
							<Suspense fallback={null}>
								<References
									producerInsertEndpoint={this.state.producerInsertEndpoint}
									producerEditReferenceEndpoint={this.state.producerEditReferenceEndpoint}
									producerDeleteEndpoint={this.state.producerDeleteEndpoint}
									producerReferencesEndpoint={this.state.producerReferencesEndpoint}
									producerCaregoriesEndpoint={this.state.producerCaregoriesEndpoint}
									producerBookmarksEndpoint={this.state.producerBookmarksEndpoint}
									isAuthor={this.state.isAuthor}
								/>
							</Suspense> : null
						}
						{this.state.aboutOn ?
							<Suspense fallback={null}>
								<About/>
							</Suspense> : null }
						{this.state.contactOn ?
							<Suspense fallback={null}>
								<Contact
									emailContact={this.state.emailContact}
								/>
							</Suspense> : null
						}
						{this.state.privacyPolicyOn ?
							<Suspense fallback={null}>
								<PrivacyPolicy
									emailContact={this.state.emailContact}
									domainName={this.state.domainName}
									serversLocation={this.state.serversLocation}
								/>
							</Suspense> : null
						}
						{this.state.termsOn ?
							<Suspense fallback={null}>
								<Terms
									emailContact={this.state.emailContact}
									domainName={this.state.domainName}
								/>
							</Suspense> : null
						}
					</Container>
				</div>

				<footer id="page-footer">
					<div className="footer-container responsive-text">
						<hr/>
						<Navbar sticky="bottom" className="justify-content-end">
							<Nav>
								<Nav.Link onClick={this.openAbout}>{t('about')}</Nav.Link>
								<Nav.Link onClick={this.openContact}>{t('contact')}</Nav.Link>
								<Nav.Link onClick={this.openTerms}>{t('terms')}</Nav.Link>
								<Nav.Link onClick={this.openPrivacyPolicy}>{t('privacypolicy')}</Nav.Link>
							</Nav>
						</Navbar>
					</div>
				</footer>
			</section>
		);
	}
}

export default withTranslation()(App);