import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Container, Col, Row, Modal, Nav, } from 'react-bootstrap'

import glogo from '../icons/google_logo.svg'
import mlogo from '../icons/microsoft_logo.svg'
import '../styles/Login.css'


export default function Login(props) {
	const { t } = useTranslation();

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
			<Nav.Link variant="outline-dark" onClick={handleShow}>
				{t('login.signin')}
			</Nav.Link>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header>
					<Container fluid>
						<Row>
							<Col xs="2"></Col>
							<Col xs="8">
								<div className="login-title">
									<p>
										{t('login.welcome')}
									</p>
								</div>
							</Col>
							<Col xs="2"></Col>
						</Row>
						<Row className="text-center">
							<Col xs="1"></Col>
							<Col xs="10">
							<div>
								<p>
									{t('login.message')}
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
								<div className="login-btn-div" onClick={googleLogin}>
									<span>
										<img width="20" height="20" className="login-btn-image" alt="google" src={glogo}/>
									</span>
									<span className="login-btn-text">
										{t('login.googlesignin')}
									</span>
								</div>
							</Col>
							<Col xs="2"></Col>
						</Row>
						<br/>
						<Row>
							<Col xs="2"></Col>
							<Col xs="8">
								<div className="login-btn-div" onClick={azureLogin}>
									<span>
										<img width="20" height="20" className="login-btn-image" alt="microsoft" src={mlogo}/>
									</span>
									<span className="login-btn-text">
										{t('login.msoftsignin')}
									</span>
								</div>
							</Col>
							<Col xs="2"></Col>
						</Row>
						<br/>
					</Container>
				</Modal.Body>
				<Modal.Footer>
					<div className="login-footer-text">
						<p>
							{t('login.notification')}
						</p>
					</div>
				</Modal.Footer>
			</Modal>
		</section>
	);
}