import React, { useState } from 'react';

import { Container, Col, Row, Modal, Nav, } from 'react-bootstrap'

import glogo from '../icons/google_logo.svg'
import mlogo from '../icons/microsoft_logo.svg'
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
			<Nav.Link variant="outline-dark" style={{color:"white"}} onClick={handleShow}>
				Sign in
			</Nav.Link>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header>
					<Container fluid>
						<Row>
							<Col xs="2"></Col>
							<Col xs="8">
								<div class="login-title">
									<p>
										Welcome!
									</p>
								</div>
							</Col>
							<Col xs="2"></Col>
						</Row>
						<Row>
							<Col xs="1"></Col>
							<Col xs="10">
							<div>
								<p>
									Please sign in with one of the listed providers below.
								</p>
							</div>
							</Col>
							<Col xs="1"></Col>
						</Row>
					</Container>
				</Modal.Header>
				<Modal.Body>
					<Container fluid>
						<Row>
							<Col xs="2"></Col>
							<Col xs="8">
								<div class="login-btn-div" onClick={googleLogin}>
									<span>
										<img width="20" height="20" class="login-btn-image" alt="google" src={glogo}/>
									</span>
									<span class="login-btn-text">
										Sign in with Google
									</span>
								</div>
							</Col>
							<Col xs="2"></Col>
						</Row>
						<br/>
						<Row>
							<Col xs="2"></Col>
							<Col xs="8">
								<div class="login-btn-div" onClick={azureLogin}>
									<span>
										<img width="20" height="20" class="login-btn-image" alt="microsoft" src={mlogo}/>
									</span>
									<span class="login-btn-text">
										Sign in with Microsoft
									</span>
								</div>
							</Col>
							<Col xs="2"></Col>
						</Row>
						<br/>
					</Container>
				</Modal.Body>
				<Modal.Footer>
					<div class="login-footer-text">
						<p>
							You do not need to Sign in to search for references!
							Sign in only if you want to access extra features or submit a request to become an author.
						</p>
					</div>
				</Modal.Footer>
			</Modal>
		</section>
	);
}