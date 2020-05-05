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
		token: null,
		producerLoginEndpoint: process.env.REACT_APP_PRODUCER_LOGIN_ENDPOINT,
		producerInsertEndpoint: process.env.REACT_APP_PRODUCER_INSERT_ENDPOINT,
	}

	componentDidMount() {
		var token = (window.location.search.match(/token=([^&]+)/) || [])[1]

		if (typeof token === 'undefined') {
			this.setState({
				token: null
			})
		} else {
			this.setState({
				token: decodeURI(token)
			})
		}
	}

	googleLogin = () => {
		var auth_provider = "google-oidc"
		var login_url = this.state.producerLoginEndpoint + "?auth_provider=" + auth_provider
		window.location.href = login_url
	}

	addReference = () => {
		console.log(testReference)

		const putReference = {
			method: 'PUT',
			headers: {
				"WWW-Authenticate": "Bearer " + this.state.token
			},
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
				{this.state.token === null ?
					<button onClick={this.googleLogin}>Google Login</button> :
					<button onClick={this.addReference}>Add Reference</button>
				}
			</section>
		);
	}
}

export default App;