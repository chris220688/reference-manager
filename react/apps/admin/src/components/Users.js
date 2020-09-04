import React, { Component } from 'react';

import {
	Col, Container, Dropdown, DropdownButton, Form, Row, Table
} from 'react-bootstrap'

import '../styles/Users.css'


class Users extends Component {

	state = {
		adminUsersEndpoint: this.props.adminUsersEndpoint,
		adminUserEndpoint: this.props.adminUserEndpoint,
		users: [],
		requested_join_filter: null,
		is_author_filter: null,
	}

	componentDidMount() {
		this.handleFilter(this.state.requested_join_filter, this.state.is_author_filter)
	}

	handleRequestJoinFilter = (eventKey) => {
		var filterOption
		if (eventKey === "0") {filterOption = null}
		if (eventKey === "1") {filterOption = 1}
		if (eventKey === "2") {filterOption = 2}

		const requested_join_filter = filterOption
		const is_author_filter = this.state.is_author_filter

		this.handleFilter(requested_join_filter, is_author_filter)
	}

	handleIsAuthorFilter = (eventKey) => {
		var filterOption
		if (eventKey === "0") {filterOption = null}
		if (eventKey === "1") {filterOption = 1}
		if (eventKey === "2") {filterOption = 2}

		const requested_join_filter = this.state.requested_join_filter
		const is_author_filter = filterOption

		this.handleFilter(requested_join_filter, is_author_filter)
	}

	handleFilter = (requested_join_filter, is_author_filter) => {
		const filterUsersRequest = {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				requested_join: requested_join_filter,
				is_author: is_author_filter,
			})
		}

		fetch(this.state.adminUsersEndpoint, filterUsersRequest)
		.then(response => response.json())
		.then(data => {
			this.setState({
				users: data['users'],
				requested_join_filter: requested_join_filter,
				is_author_filter: is_author_filter,
			})
		})
		.catch(err => {})
	}

	getRequestJoinFilterOption = () => {
		const requested_join_filter = this.state.requested_join_filter
		if ( requested_join_filter === null) { return "-"}
		if ( requested_join_filter === 1) { return "Yes"}
		if ( requested_join_filter === 2) { return "No"}
	}

	getIsAuthorFilterOption = () => {
		const is_author_filter = this.state.is_author_filter
		if ( is_author_filter === null) { return "-"}
		if ( is_author_filter === 1) { return "Yes"}
		if ( is_author_filter === 2) { return "No"}
	}

	updateRequestedJoin = (event, user) => {
		const updateUserRequest = {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				internal_sub_id: user.internal_sub_id,
				requested_join: event.target.checked,
			})
		}

		fetch(this.state.adminUserEndpoint, updateUserRequest)
		.then(response => response.json())
		.then(data => {
			if ( data.success ) {
				this.handleFilter(this.state.requested_join_filter, this.state.is_author_filter)
			}
		})
		.catch(err => {})
	}

	updateIsAuthor = (event, user) => {
		const updateUserRequest = {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				internal_sub_id: user.internal_sub_id,
				is_author: event.target.checked,
			})
		}

		fetch(this.state.adminUserEndpoint, updateUserRequest)
		.then(response => response.json())
		.then(data => {
			if ( data.success ) {
				this.handleFilter(this.state.requested_join_filter, this.state.is_author_filter)
			}
		})
		.catch(err => {})
	}

	render() {
		return (
			<Container>
				<Row>
					<Col>
						<label for="request-join-dropdown">Requested Join</label>
						<DropdownButton
							size="sm"
							variant="secondary"
							id="request-join-dropdown"
							title={this.getRequestJoinFilterOption()}
						>
							<Dropdown.Item
								eventKey="1"
								onSelect={(eventKey, event) => this.handleRequestJoinFilter(eventKey)}
							>Yes</Dropdown.Item>
							<Dropdown.Item
								eventKey="2"
								onSelect={(eventKey, event) => this.handleRequestJoinFilter(eventKey)}
							>No</Dropdown.Item>
							<Dropdown.Item
								eventKey="0"
								onSelect={(eventKey, event) => this.handleRequestJoinFilter(eventKey)}
							>-</Dropdown.Item>
						</DropdownButton>
					</Col>
					<Col>
						<label for="is-author-dropdown">Is Author</label>
						<DropdownButton
							size="sm"
							variant="secondary"
							id="is-author-dropdown"
							title={this.getIsAuthorFilterOption()}
						>
							<Dropdown.Item
								eventKey="1"
								onSelect={(eventKey, event) => this.handleIsAuthorFilter(eventKey)}
							>Yes</Dropdown.Item>
							<Dropdown.Item
								eventKey="2"
								onSelect={(eventKey, event) => this.handleIsAuthorFilter(eventKey)}
							>No</Dropdown.Item>
							<Dropdown.Item
								eventKey="0"
								onSelect={(eventKey, event) => this.handleIsAuthorFilter(eventKey)}
							>-</Dropdown.Item>
						</DropdownButton>
					</Col>
				</Row>

				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Username</th>
							<th>Requested Join</th>
							<th>Is author</th>
						</tr>
					</thead>
					<tbody>
						{this.state.users.map((user, index) => (
						<tr key={index}>
							<td>{user.username}</td>
							<td>
								<Form.Check
									type="checkbox"
									checked={user.requested_join ? true : false}
									label={user.requested_join ? "Yes" : "No"}
									onChange={(event) => this.updateRequestedJoin(event, user)}
								/>
							</td>
							<td>
								<Form.Check
									type="checkbox"
									checked={user.is_author ? true : false}
									label={user.is_author ? "Yes" : "No"}
									onChange={(event) => this.updateIsAuthor(event, user)}
								/>
							</td>
						</tr>
						))}
					</tbody>
				</Table>
			</Container>
		);
	}
}

export default Users;