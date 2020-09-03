import React, { useState } from 'react';

import { Button, Container, Col, Form, Row, Modal, Nav, } from 'react-bootstrap'

import '../styles/Login.css'


export default function Login(props) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handleSubmit = (event) => {
		event.preventDefault()
		const form = event.target

		const loginRequest = {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				username: form.elements.username.value,
				password: form.elements.password.value,
			}),
		}

		fetch(props.adminLoginEndpoint, loginRequest)
		.then(response => response.json())
		.then(data => {
			window.location.assign('/Home')
		})
		.catch(err => {})
	}

	return (
		<section>
			<Nav.Link variant="outline-dark" onClick={handleShow}>
				Login
			</Nav.Link>
			<Modal show={show} onHide={handleClose}>
				<Modal.Body>
					<Container fluid>
						<Form onSubmit={handleSubmit}>
							<Form.Group controlId="formBasicEmail">
								<Form.Label>Email address</Form.Label>
								<Form.Control type="email" name="username" placeholder="Enter email"/>
							</Form.Group>

							<Form.Group controlId="formBasicPassword">
								<Form.Label>Password</Form.Label>
								<Form.Control type="password" name="password" placeholder="Password"/>
							</Form.Group>
							<Button variant="primary" type="submit">Submit</Button>
						</Form>
					</Container>
				</Modal.Body>
			</Modal>
		</section>
	);
}