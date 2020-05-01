import React, { Component } from 'react';

import Search from './Search';


class App extends Component {

	render() {
		function googleLogin() {
			window.location.href = process.env.REACT_APP_GOOGLE_LOGIN_ENDPOINT
		}

		return (
			<section>
				<button onClick={googleLogin}>Google Login</button>
			</section>
		);
	}
}

export default App;