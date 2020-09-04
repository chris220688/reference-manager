import React, { Component } from 'react';

import {
	Col, Container, Dropdown, DropdownButton, Form, Row, Table
} from 'react-bootstrap'

import '../styles/References.css'


class References extends Component {

	state = {
		adminReferencesEndpoint: this.props.adminReferencesEndpoint,
		adminReferenceEndpoint: this.props.adminReferenceEndpoint,
		references: [],
		amazon_filter: null,
		waterstones_filter: null,
		bookdepository_filter: null,
	}

	componentDidMount() {
		this.handleFilter(
			this.state.amazon_filter,
			this.state.waterstones_filter,
			this.state.bookdepository_filter,
		)
	}

	handleAmazonFilter = (eventKey) => {
		var filterOption
		if (eventKey === "0") {filterOption = null}
		if (eventKey === "1") {filterOption = 1}
		if (eventKey === "2") {filterOption = 2}

		const amazon_filter = filterOption
		const waterstones_filter = this.state.waterstones_filter
		const bookdepository_filter = this.state.bookdepository_filter

		this.handleFilter(amazon_filter, waterstones_filter, bookdepository_filter)
	}

	handleWaterstonesFilter = (eventKey) => {
		var filterOption
		if (eventKey === "0") {filterOption = null}
		if (eventKey === "1") {filterOption = 1}
		if (eventKey === "2") {filterOption = 2}

		const amazon_filter = this.state.amazon_filter
		const waterstones_filter = filterOption
		const bookdepository_filter = this.state.bookdepository_filter

		this.handleFilter(amazon_filter, waterstones_filter, bookdepository_filter)
	}

	handleBookDepositoryFilter = (eventKey) => {
		var filterOption
		if (eventKey === "0") {filterOption = null}
		if (eventKey === "1") {filterOption = 1}
		if (eventKey === "2") {filterOption = 2}

		const amazon_filter = this.state.amazon_filter
		const waterstones_filter = this.state.waterstones_filter
		const bookdepository_filter = filterOption

		this.handleFilter(amazon_filter, waterstones_filter, bookdepository_filter)
	}

	handleFilter = (amazon_filter, waterstones_filter, bookdepository_filter) => {
		const filterReferencesRequest = {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				has_amazon_links: amazon_filter,
				has_waterstones_links: waterstones_filter,
				has_bookdepository_links: bookdepository_filter,
			})
		}

		fetch(this.state.adminReferencesEndpoint, filterReferencesRequest)
		.then(response => response.json())
		.then(data => {
			this.setState({
				references: data['references'],
				amazon_filter: amazon_filter,
				waterstones_filter: waterstones_filter,
				bookdepository_filter: bookdepository_filter
			})
		})
		.catch(err => {})
	}

	getAmazonFilterOption = () => {
		const amazon_filter = this.state.amazon_filter
		if ( amazon_filter === null) { return "-"}
		if ( amazon_filter === 1) { return "Yes"}
		if ( amazon_filter === 2) { return "No"}
	}

	getWaterstonesFilterOption = () => {
		const waterstones_filter = this.state.waterstones_filter
		if ( waterstones_filter === null) { return "-"}
		if ( waterstones_filter === 1) { return "Yes"}
		if ( waterstones_filter === 2) { return "No"}
	}

	getBookDepositoryFilterOption = () => {
		const bookdepository_filter = this.state.bookdepository_filter
		if ( bookdepository_filter === null) { return "-"}
		if ( bookdepository_filter === 1) { return "Yes"}
		if ( bookdepository_filter === 2) { return "No"}
	}

	updateAmazon = (event, reference) => {
		const updateReferenceRequest = {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				reference_id: reference.reference_id,
				has_amazon_links: event.target.checked,
			})
		}

		fetch(this.state.adminReferenceEndpoint, updateReferenceRequest)
		.then(response => response.json())
		.then(data => {
			if ( data.success ) {
				this.handleFilter(
					this.state.amazon,
					this.state.waterstones_filter,
					this.state.bookdepository_filter
				)
			}
		})
		.catch(err => {})
	}

	updateWaterstones = (event, reference) => {
		const updateReferenceRequest = {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				reference_id: reference.reference_id,
				has_waterstones_links: event.target.checked,
			})
		}

		fetch(this.state.adminReferenceEndpoint, updateReferenceRequest)
		.then(response => response.json())
		.then(data => {
			if ( data.success ) {
				this.handleFilter(
					this.state.amazon,
					this.state.waterstones_filter,
					this.state.bookdepository_filter
				)
			}
		})
		.catch(err => {})
	}

	updateAmazon = (event, reference) => {
		const updateReferenceRequest = {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				reference_id: reference.reference_id,
				has_bookdepository_links: event.target.checked,
			})
		}

		fetch(this.state.adminReferenceEndpoint, updateReferenceRequest)
		.then(response => response.json())
		.then(data => {
			if ( data.success ) {
				this.handleFilter(
					this.state.amazon,
					this.state.waterstones_filter,
					this.state.bookdepository_filter
				)
			}
		})
		.catch(err => {})
	}

	render() {
		return (
			<Container>
				<Row>
					<Col>
						<label for="amazon-dropdown">Has Amazon links</label>
						<DropdownButton
							size="sm"
							variant="secondary"
							id="amazon-dropdown"
							title={this.getAmazonFilterOption()}
						>
							<Dropdown.Item
								eventKey="1"
								onSelect={(eventKey, event) => this.handleAmazonFilter(eventKey)}
							>Yes</Dropdown.Item>
							<Dropdown.Item
								eventKey="2"
								onSelect={(eventKey, event) => this.handleAmazonFilter(eventKey)}
							>No</Dropdown.Item>
							<Dropdown.Item
								eventKey="0"
								onSelect={(eventKey, event) => this.handleAmazonFilter(eventKey)}
							>-</Dropdown.Item>
						</DropdownButton>
					</Col>
					<Col>
						<label for="waterstones-dropdown">Has Waterstones links</label>
						<DropdownButton
							size="sm"
							variant="secondary"
							id="waterstones-dropdown"
							title={this.getWaterstonesFilterOption()}
						>
							<Dropdown.Item
								eventKey="1"
								onSelect={(eventKey, event) => this.handleWaterstonesFilter(eventKey)}
							>Yes</Dropdown.Item>
							<Dropdown.Item
								eventKey="2"
								onSelect={(eventKey, event) => this.handleWaterstonesFilter(eventKey)}
							>No</Dropdown.Item>
							<Dropdown.Item
								eventKey="0"
								onSelect={(eventKey, event) => this.handleWaterstonesFilter(eventKey)}
							>-</Dropdown.Item>
						</DropdownButton>
					</Col>
					<Col>
						<label for="bookdepository-dropdown">Has Book Depository links</label>
						<DropdownButton
							size="sm"
							variant="secondary"
							id="bookdepository-dropdown"
							title={this.getBookDepositoryFilterOption()}
						>
							<Dropdown.Item
								eventKey="1"
								onSelect={(eventKey, event) => this.handleBookDepositoryFilter(eventKey)}
							>Yes</Dropdown.Item>
							<Dropdown.Item
								eventKey="2"
								onSelect={(eventKey, event) => this.handleBookDepositoryFilter(eventKey)}
							>No</Dropdown.Item>
							<Dropdown.Item
								eventKey="0"
								onSelect={(eventKey, event) => this.handleBookDepositoryFilter(eventKey)}
							>-</Dropdown.Item>
						</DropdownButton>
					</Col>
				</Row>

				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Title</th>
							<th>Amazon links</th>
							<th>Waterstones links</th>
							<th>Bookdepository links</th>
						</tr>
					</thead>
					<tbody>
						{this.state.references.map((reference, index) => (
						<tr key={index}>
							<td>{reference.title}</td>
							<td>
								{reference.books.map((book, index) => (
									<div>
										<div>{book.name}</div>
										<div>
											{book.book_links.map((book_link, index) => (
												<span>
													{book_link.link_type === "amazon" ? book_link.link_url : null }
												</span>
											))}
										</div>
									</div>
								))}
							</td>
							<td>
								{reference.books.map((book, index) => (
									<div>
										<div>{book.name}</div>
										<div>
											{book.book_links.map((book_link, index) => (
												<span>
													{book_link.link_type === "waterstones" ? book_link.link_url : null }
												</span>
											))}
										</div>
									</div>
								))}
							</td>
							<td>
								{reference.books.map((book, index) => (
									<div>
										<div>{book.name}</div>
										<div>
											{book.book_links.map((book_link, index) => (
												<span>
													{book_link.link_type === "bookdepository" ? book_link.link_url : null }
												</span>
											))}
										</div>
									</div>
								))}
							</td>
						</tr>
						))}
					</tbody>
				</Table>
			</Container>
		);
	}
}

export default References;