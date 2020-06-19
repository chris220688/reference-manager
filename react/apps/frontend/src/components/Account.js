import React, { Component, useState } from 'react';

import { useTranslation, withTranslation } from 'react-i18next'

import {
	Button, Col, Container, Modal, Row, Table
} from 'react-bootstrap'

import '../styles/Account.css'


class Account extends Component {

	state = {
		producerAccountDetailsEndpoint: this.props.producerAccountDetailsEndpoint,
		producerDeleteAccountEndpoint: this.props.producerDeleteAccountEndpoint,
		username: null,
		isAuthor: false,
		requestedJoin: false,
		createdAt: null,
	}

	componentDidMount() {
		this.getAccountDetails()
	}

	getAccountDetails = () => {
		const accountRequest = {
			method: 'GET',
			credentials: 'include',
		}

		fetch(this.state.producerAccountDetailsEndpoint, accountRequest)
		.then(response => response.json())
		.then(data => {
			this.setState({
				username: data['username'],
				isAuthor: data['is_author'],
				requestedJoin: data['requested_join'],
				createdAt: data['created_at'].slice(0, 10),
			})
		})
		.catch(err => console.log(err))
	}

	deleteAccount = () => {
		const deleteAccountRequest = {
			method: 'DELETE',
			credentials: 'include',
		}

		fetch(this.state.producerDeleteAccountEndpoint, deleteAccountRequest)
		.then(response => response.json())
		.then(data => {
			if (data['deleted']) {
				window.location.reload()
			}
		})
		.catch(err => console.log(err))
	}

	render() {
		const { t } = this.props
		return (
			<Container>
				<Row className="text-center">
					<Col xs="1" sm="2" md="3" xl="4"></Col>
					<Col xs ="10" sm="8" md="6" xl="4">
						<h3>{t('myaccount.settings')}</h3>
					</Col>
					<Col xs="1" sm="2" md="3" xl="4"></Col>
				</Row>
				<br/>

				<Row>
					<Col xs="1" sm="2" md="3" xl="4"></Col>
					<Col xs ="10" sm="8" md="6" xl="4">
						<Table bordered striped hover>
							<tbody>
								<tr>
									<td>{t('myaccount.username')}</td>
									<td>{this.state.username}</td>
								</tr>
								<tr>
									<td>{t('myaccount.registrationdate')}</td>
									<td>{this.state.createdAt}</td>
								</tr>
								<tr>
									<td>{t('myaccount.accountstatus')}</td>
									{this.state.isAuthor ?
										<td>{t('myaccount.author')}</td> : <td>{t('myaccount.user')}</td>
									}
								</tr>
								<tr>
									<td>{t('myaccount.authorstatus')}</td>
									{this.state.requestedJoin && this.state.isAuthor ?
										<td style={{"color": "#19b119"}}><b>{t('myaccount.confirmed')}</b></td>: null
									}
									{this.state.requestedJoin && !this.state.isAuthor ?
										<td style={{"color": "#bc900d"}}><b>{t('myaccount.pending')}</b></td>: null
									}
									{!this.state.requestedJoin ?
										<td>{t('myaccount.notrequested')}</td>: null
									}
								</tr>

							</tbody>
						</Table>
					</Col>
					<Col xs="1" sm="2" md="3" xl="4"></Col>
				</Row>
				<br/>

				<Row>
					<Col xs="1" sm="2" md="3" xl="4"></Col>
					<Col xs ="5" sm="4" md="3" xl="2">
						<b>{t('myaccount.deleteaccount')}:</b>
					</Col>
					<Col xs ="5" sm="4" md="3" xl="2">
						<DeleteAccount deleteAccount={this.deleteAccount}/>
					</Col>
					<Col xs="1" sm="2" md="3" xl="4"></Col>
				</Row>

			</Container>
		)
	}
}

function DeleteAccount(props) {
	const { t } = useTranslation();

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<Container>
			<Button variant="danger" size="sm" className="float-right" onClick={handleShow}>
				{t('myaccount.modal.delete')}
			</Button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>{t('myaccount.modal.areyousure')}</Modal.Title>
				</Modal.Header>
				<Modal.Body className="text-center">
					<p>
						{t('myaccount.modal.p1')}
					</p>
					<p>
						{t('myaccount.modal.p2')}
					</p>
					<p>
						{t('myaccount.modal.p3')}
					</p>
					<p>
						{t('myaccount.modal.p4')}
					</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" size="sm" onClick={handleClose}>
						{t('myaccount.modal.nope')}!
					</Button>
					<Button variant="danger" size="sm" className="float-right" onClick={props.deleteAccount}>
						{t('myaccount.modal.confirm')}!
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
}

export default withTranslation()(Account);