import React, { useState } from 'react';

import { Button, Container, Col, Row, Modal } from 'react-bootstrap'

import glogo from '../icons/google_logo.svg'
import '../styles/Login.css'


export default function Login(props) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const googleLogin = () => {
		var auth_provider = "google-oidc"
		var login_url = props.producerLoginRedirectEndpoint + "?auth_provider=" + auth_provider
		window.location.href = login_url
	}

	const azureLogin = () => {
		var auth_provider = "azure-oidc"
		var login_url = props.producerLoginRedirectEndpoint + "?auth_provider=" + auth_provider
		window.location.href = login_url
	}

	return (
		<section>
			<Button variant="outline-dark" onClick={handleShow}>
				Log in
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Body>
					<Container fluid>
						<Row>
							<div class="login-title">
								<p>
									Welcome!
								</p>
							</div>
						</Row>
						<br/>
						<Row>
							<Col sm="2"></Col>
							<Col sm="8">
								<div class="google-div" onClick={googleLogin}>
									<span>
										<img width="20" height="20" class="google-image" alt="google" src={glogo}/>
									</span>
									<span class="google-btn-text">
										Continue with Google
									</span>
								</div>
							</Col>
							<Col sm="2"></Col>
						</Row>
						<Row>
							<Col sm="2"></Col>
							<Col sm="8">
								<div class="google-div" onClick={azureLogin}>
									<span>
										<img width="20" height="20" class="google-image" alt="google" src={glogo}/>
									</span>
									<span class="google-btn-text">
										Continue with Azure
									</span>
								</div>
							</Col>
							<Col sm="2"></Col>
						</Row>
					</Container>
				</Modal.Body>
				<Modal.Footer>
					We log user data and share it with service providers. Click “Sign In” above to accept the Terms of Service & Privacy Policy.
				</Modal.Footer>
			</Modal>
		</section>
	);
}