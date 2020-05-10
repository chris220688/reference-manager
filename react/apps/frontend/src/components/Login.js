import React, { useState } from 'react';

import { Button, Modal } from 'react-bootstrap'


export default function Login(props) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const googleLogin = () => {
		var auth_provider = "google-oidc"
		var login_url = props.producerLoginRedirectEndpoint + "?auth_provider=" + auth_provider
		window.location.href = login_url
	}

	return (
		<section>
			<Button variant="primary" onClick={handleShow}>
				Login
			</Button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Body>
					<Button variant="secondary" onClick={googleLogin}>
						Google Login
					</Button>
				</Modal.Body>
			</Modal>
		</section>
	);
}