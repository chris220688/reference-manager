import React, { Component } from 'react';

import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import {
	Alert, Container, Dropdown, Navbar, Nav
} from 'react-bootstrap'

import '../styles/App.css'

import Home from './Home'
import Login from './Login'
import Users from './Users'
import References from './References'


class App extends Component {

	state = {
		adminLoginEndpoint: "http://localhost:8000/login",
		adminLoginCheckEndpoint: "http://localhost:8000/user-session-status",
		adminLogoutEndpoint: "http://localhost:8000/logout",
		adminUsersEndpoint: "http://localhost:8000/users",
		adminUserEndpoint: "http://localhost:8000/user",
		adminReferencesEndpoint: "http://localhost:8000/references",
		adminReferenceEndpoint: "http://localhost:8000/reference",
		userLoggedIn: false,
	}

	componentDidMount() {
		this.checkUserSessionStatus()
	}

	checkUserSessionStatus = () => {
		const request = {
			method: 'GET',
			credentials: 'include'
		}

		fetch(this.state.adminLoginCheckEndpoint, request)
		.then(response => response.json())
		.then(data => {
			this.setState({
				userLoggedIn: data['userLoggedIn'],
			})
		})
		.catch(err => {})
	}

	logout = () => {
		const request = {
			method: 'GET',
			credentials: 'include'
		}

		fetch(this.state.adminLogoutEndpoint, request)
		.then(response => response.json())
		.then(data => {
			window.location.assign('/')
		})
		.catch(err => {})
	}

	render() {
		return (
			<section id="page-container">
				<BrowserRouter>
					<Navbar bg="light" expand="md" sticky="top">
						<Navbar.Toggle aria-controls="basic-navbar-nav"></Navbar.Toggle>
						<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end custom-nav-items">

							<Nav className="mr-auto">
								{this.state.userLoggedIn ?
									<Link to={'/users'} className="nav-link">Users</Link> : null
								}
								{this.state.userLoggedIn ?
									<Link to={'/references'} className="nav-link">References</Link> : null
								}
							</Nav>

							<Nav>
								{this.state.userLoggedIn ?
									<Nav.Link onClick={this.logout}>Logout</Nav.Link> :
									<Login adminLoginEndpoint={this.state.adminLoginEndpoint}/>
								}
							</Nav>
						</Navbar.Collapse>
					</Navbar>

					<Switch>
						<Route exact path='/' component={Home} />
						{this.state.userLoggedIn ?
						<Route path='/users' component={
							() => 	<Users
										adminUsersEndpoint={this.state.adminUsersEndpoint}
										adminUserEndpoint={this.state.adminUserEndpoint}
									/>
							} /> : null
						}
						{this.state.userLoggedIn ?
						<Route path='/references' component={
							() => 	<References
										adminReferencesEndpoint={this.state.adminReferencesEndpoint}
										adminReferenceEndpoint={this.state.adminReferenceEndpoint}
									/>
							} /> : null
						}
					</Switch>
				</BrowserRouter>
			</section>
		);
	}
}

export default App;