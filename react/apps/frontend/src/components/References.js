import React, { Component } from 'react';

import { Accordion, Alert, Button, Card, Col, Container, Form, InputGroup, ListGroup, Row, Tab, Tabs, FormControl } from 'react-bootstrap'

import { IoIosTrash } from "react-icons/io";

import '../styles/References.css'


class References extends Component {

	state = {
		producerInsertEndpoint: this.props.producerInsertEndpoint,
		producerReferencesEndpoint: this.props.producerReferencesEndpoint,
		closeReferences: this.props.closeReferences,
		references: [],
		books: {},
		currentBook: '',
		currentSections: {},
		title: null,
		date: null,
		description: null,
		loading: true,
		error: null
	}

	componentDidMount() {
		const request = {
			method: 'GET',
			credentials: 'include',
		}

		fetch(this.state.producerReferencesEndpoint, request)
		.then(response => response.json())
		.then(data => {
			this.setState({
				references: data['references'],
				loading: false
			})
		})
		.catch(err => console.log(err))
	}

	addError = (error) => {
		this.setState({
			error: error,
		})
	}

	handleTitleChange = (event) => {
		this.setState({
			title: event.target.value,
		})
	}

	handleDateChange = (event) => {
		this.setState({
			date: event.target.value,
		})
	}

	handleDescriptionChange = (event) => {
		this.setState({
			description: event.target.value,
		})
	}

	handleBookChange = (event) => {
		this.setState({
			currentBook: event.target.value,
		})
	}

	handleStartingPageChange = (event, bookname) => {
		var currentSections = this.state.currentSections
		currentSections[bookname].startingPage = event.target.value

		this.setState({
			currentSections: currentSections,
		})
	}

	handleEndingPageChange = (event, bookname) => {
		var currentSections = this.state.currentSections
		currentSections[bookname].endingPage = event.target.value

		this.setState({
			currentSections: currentSections,
		})
	}

	addBook = () => {
		var books = this.state.books

		if (this.state.currentBook == null || this.state.currentBook == '') {
			this.addError("Please provide a name for the book")
			return
		}

		books[this.state.currentBook] = []

		var currentSections = this.state.currentSections
		currentSections[this.state.currentBook] = {
			startingPage: '',
			endingPage: ''
		}

		this.setState({
			books: books,
			currentBook: '',
			currentSections: currentSections,
		})
	}

	removeBook = (bookName) => {
		var books = this.state.books

		delete books[bookName]

		this.setState({
			books: books,
		})
	}

	addSection = (bookName) => {
		var books = this.state.books
		var currentBook = books[bookName]

		var currentSections = this.state.currentSections
		var startingPage = currentSections[bookName].startingPage
		var endingPage = currentSections[bookName].endingPage

		if (startingPage < 0 || endingPage < 0) {
			this.addError("Page numbers should be positive numbers")
			return
		}

		if (startingPage > endingPage) {
			this.addError("Starting page should be less than the ending page")
			return
		}

		if (!Number.isInteger(parseFloat(startingPage)) || !Number.isInteger(parseFloat(endingPage))) {
			this.addError("Pages should be integer numbers")
			return
		}

		currentBook.push(
			{
				starting_page: startingPage,
				ending_page: endingPage,
			}
		)

		currentSections[bookName] = {
			startingPage: '',
			endingPage: ''
		}

		this.setState({
			books: books,
			currentSections: currentSections,
		})
	}

	addReference = (event) => {
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		}

		if (this.state.title === null || this.state.title === '') {
			this.addError("Please provide a title for the event")
			return
		}

		if (this.state.description === null || this.state.description === '') {
			this.addError("Please provide a description for the event")
			return
		}

		if (this.state.description.length < 30) {
			this.addError("The description is too small. Please add some more details")
			return
		}

		if (Object.keys(this.state.books).length === 0) {
			this.addError("Please provide at least one book as a reference")
			return
		}

		var booksList = []
		for (const [ name, sections ] of Object.entries(this.state.books)) {

			if (sections.length === 0) {
				this.addError("Please provide at least one book section for every book")
				return
			}

			booksList.push({
				name: name,
				book_sections: sections,
			})
		}

		var eventDate = this.state.date
		if (eventDate !== null) {
			eventDate = eventDate + ' 00:00:00'
		}

		var reference = {
			title: this.state.title,
			event_date: eventDate,
			description: this.state.description,
			books: booksList
		}

		const putReference = {
			method: 'PUT',
			credentials: 'include',
			body: JSON.stringify(reference)
		}

		fetch(this.state.producerInsertEndpoint, putReference)
		.then(response => {
			if (!response.ok) {
				if (response.status === 422)
				this.addError("Something went wrong. Please make sure you follow the instructions on how to create a reference")
			}
			response.json()
		})
		.then(data => {
			var references = this.state.references
			references.push(reference)
			this.setState({
				references: references
			})
		})
		.catch(err => {
			this.addError("Something went wrong. Please try again")
		})
	}

	render() {
		return (
			<section>
				<Tabs defaultActiveKey="references">
					<Tab eventKey="references" title="My References">
						<Container fluid>
							<Row>
								<br/>
							</Row>
							<Row>
								<Col>
									{this.state.loading ? (
										"Loading..."
									) : (
										<Accordion defaultActiveKey="0">
											{this.state.references.map(({ title, description, event_date, books }, index) => (
												<Card>
													<Accordion.Toggle as={Card.Header} eventKey={index}>
														{title}
													</Accordion.Toggle>
													<Accordion.Collapse eventKey={index}>
														<Card.Body>
															<Container>
																<Row>
																	<Col className="text-left">
																		Description: {description}
																	</Col>
																</Row>
																<Row>
																	<Col>
																		Event date: {event_date}
																	</Col>
																</Row>
																<Row>
																	<Col>
																		<ul>
																		{books.map(({ name, book_sections }) => (
																			<li>
																				{name}
																				<ul>
																					{book_sections.map(({ starting_page, ending_page }) => (
																						<li>
																							{starting_page}-{ending_page}
																						</li>
																					))}
																				</ul>
																			</li>
																		))}
																		</ul>
																	</Col>
																</Row>
																<Row>
																	<Col>
																		<Button className="float-right" size="sm" variant="danger">
																			<IoIosTrash/>
																		</Button>
																	</Col>
																</Row>
															</Container>
														</Card.Body>
													</Accordion.Collapse>
												</Card>
											))}
										</Accordion>
									)}
								</Col>
							</Row>
						</Container>
					</Tab>

					<Tab eventKey="addReference" title="New Reference">
						<br/>
							{this.state.error ?
								<Alert variant="danger" onClose={() => this.addError(null)} dismissible>
									{this.state.error}
								</Alert> : <span></span>
							}
						<Form>
							<Form.Row>
								<Form.Group as={Col} md="6" controlId="titleValidation">
									<Form.Control
										required
										type="text"
										onChange={this.handleTitleChange}
										placeholder="Event title"
										className="form-control:invalid form-control"
									/>
								</Form.Group>

								<Form.Group as={Col} md="6" controlId="dateValidation">
									<Form.Control
										type="date"
										onChange={this.handleDateChange}
										placeholder="Event date"
									/>
								</Form.Group>
							</Form.Row>

							<Form.Row>
								<Form.Group as={Col} controlId="descriptionValidation">
									<Form.Control
										required
										as="textarea"
										rows="5"
										onChange={this.handleDescriptionChange}
										placeholder="Event description"
									/>
								</Form.Group>
							</Form.Row>

							<Form.Row>
								<Form.Group as={Col} sm="8" md="10">
									<Form.Control
										type="text"
										value={this.state.currentBook}
										onChange={this.handleBookChange}
										placeholder="Book title"
									/>
								</Form.Group>

								<div as={Col} sm="4" md="2">
									<Button variant="link" onClick={this.addBook}>Add new book</Button>
								</div>
							</Form.Row>

							<Form.Row>
								<Col>
									<ListGroup as={Col}>
										{Object.entries(this.state.books).map(([bookName, sections], bookIndex) => (
											<ListGroup.Item key={bookIndex}>
												<Form.Row>
												<Container>
													<Row>
														<Col xs={11} className="limited-text">
															<b>Book:</b> {bookName}
														</Col>
														<Col xs={1}>
															<Button className="float-right" size="sm" variant="danger" onClick={() => this.removeBook(bookName)}><IoIosTrash/></Button>
														</Col>
													</Row>
												</Container>
												</Form.Row>

												<Form.Row>
												<Container fluid>
													<Row>
														<Col className="limited-text">
															<div className="limited-text"><b>Pages: </b>
															{sections.map(({ starting_page, ending_page }, sectionIndex) => (
																<span key={sectionIndex}>|{starting_page}-{ending_page}| </span>
															))}
															</div>
														</Col>
													</Row>
												</Container>
												</Form.Row>
												<hr/>
												<Form.Row>
													<Form.Group as={Col} sm="4" md="2" controlId="startingPageValidation">
														<Form.Control
															type="number"
															min="0"
															value={this.state.currentSections[bookName].startingPage}
															onChange={(event) => this.handleStartingPageChange(event, bookName)}
															placeholder="Starting page"
														/>
													</Form.Group>

													<Form.Group as={Col} sm="4" md="2" controlId="endingPageValidation">
														<Form.Control
															type="number"
															min="0"
															value={this.state.currentSections[bookName].endingPage}
															onChange={(event) => this.handleEndingPageChange(event, bookName)}
															placeholder="Ending page"
														/>
													</Form.Group>

													<div as={Col} sm="4" md="2">
														<Button variant="link" onClick={() => this.addSection(bookName)}>Add new section</Button>
													</div>
												</Form.Row>
											</ListGroup.Item>
										))}
									</ListGroup>
								</Col>
							</Form.Row>
							<hr/>
							<Form.Row>
								<Col>
									<Button size="sm" variant="outline-dark" onClick={this.addReference}>Create reference</Button>
								</Col>
								<Col className="text-right">
									<Button size="sm" variant="outline-dark" onClick={this.props.closeReferences}>
										Back
									</Button>
								</Col>
							</Form.Row>
						</Form>
					</Tab>
				</Tabs>
			</section>
		);
	}
}

export default References;