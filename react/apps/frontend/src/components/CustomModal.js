import React, { useState } from 'react'

import { Modal, Nav, } from 'react-bootstrap'
import '../styles/CustomModal.css'


export default function CustomModal(props) {
	const [show, setShow] = useState(props.defaultShow)

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	return (
		<section>
			{props.showBtn ?
				<Nav.Link variant="outline-dark" onClick={handleShow}>
					{props.btnText}
				</Nav.Link> : null
			}
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					{props.header}
				</Modal.Header>
				<Modal.Body>
					{props.body}
				</Modal.Body>
				<Modal.Footer>
					{props.footer}
				</Modal.Footer>
			</Modal>
		</section>
	)
}