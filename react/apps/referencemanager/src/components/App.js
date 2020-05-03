import React, { Component } from 'react';

import Search from './Search';


class App extends Component {

	state = {
		token: null,
		producerLoginEndpoint: process.env.REACT_APP_PRODUCER_LOGIN_ENDPOINT
	}

	componentDidMount() {
		var token = (window.location.search.match(/token=([^&]+)/) || [])[1]

		if ( token == 'undefined' ) {
			this.setState({
				token: null
			})
		} else {
			this.setState({
				token: token
			})
		}

		console.log("token: " + token)
	}

	googleLogin = () => {
		var auth_provider = "google-oidc"
		var login_url = this.state.producerLoginEndpoint + "?auth_provider=" + auth_provider
		window.location.href = login_url
	}

	render() {

		return (
			<section>
				<button onClick={this.googleLogin}>Google Login</button>
			</section>
		);
	}
}

export default App;