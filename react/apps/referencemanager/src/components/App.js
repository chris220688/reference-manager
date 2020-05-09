import React, { Component } from 'react';

import Search from './Search';

var testReference = {
	title: "The battle of the Waterloo",
	event_date: "1780-05-18T16:00:00Z",
	description: "A battle between France and England, A battle between France and England",
	books: [
		{
			name: "Book of English literature",
			book_sections: [
				{
					starting_page: 2,
					ending_page: 3
				}
			]
		},
		{
			name: "Another book",
			book_sections: [
				{
					starting_page: 7,
					ending_page: 8
				}
			]
		}
	],
	rating: 5
}

class App extends Component {

	state = {
		userLoggedIn: false,
		username: null,
		permissions: [],
		producerLoginRedirectEndpoint: process.env.REACT_APP_PRODUCER_LOGIN_REDIRECT_ENDPOINT,
		producerLoginEndpoint: process.env.REACT_APP_PRODUCER_LOGIN_ENDPOINT,
		producerLoginCheckEndpoint: process.env.REACT_APP_PRODUCER_LOGIN_CHECK_ENDPOINT,
		producerInsertEndpoint: process.env.REACT_APP_PRODUCER_INSERT_ENDPOINT,
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

	googleLogin = () => {
		var auth_provider = "google-oidc"
		var login_url = this.state.producerLoginRedirectEndpoint + "?auth_provider=" + auth_provider
		window.location.href = login_url
	}

	addReference = () => {
		console.log(testReference)

		const putReference = {
			method: 'PUT',
			headers: {
				"Authorization": "Bearer " + this.state.authToken
			},
			credentials: 'include',
			body: JSON.stringify(testReference)
		}

		fetch(this.state.producerInsertEndpoint, putReference)
		.then(response => response.json())
		.then(data => console.log(data))
		.catch(err => console.log(err))
	}

	render() {

		return (
			<section>
				<Search/>
				{this.state.userLoggedIn ?
					<button onClick={this.addReference}>Add Reference</button> :
					<button onClick={this.googleLogin}>Google Login</button>
				}
			</section>
		);
	}
}

export default App;