import React, { Component } from 'react';

import { withTranslation } from 'react-i18next'
import {
	Alert, Button, Col, Container, Dropdown,
	DropdownButton, Form, ListGroup, Row, Tab, Tabs
} from 'react-bootstrap'

import { IoIosTrash } from "react-icons/io";

import '../styles/References.css'


class References extends Component {

	state = {
		producerInsertEndpoint: this.props.producerInsertEndpoint,
		producerDeleteEndpoint: this.props.producerDeleteEndpoint,
		producerReferencesEndpoint: this.props.producerReferencesEndpoint,
		producerCaregoriesEndpoint: this.props.producerCaregoriesEndpoint,
		categories: [],
		references: [],
		books: {},
		currentBook: "",
		currentSections: {},
		title: null,
		category: null,
		description: null,
		loading: true,
		error: null
	}

	componentDidMount() {
		const referencesRequest = {
			method: 'GET',
			credentials: 'include',
		}

		fetch(this.state.producerReferencesEndpoint, referencesRequest)
		.then(response => response.json())
		.then(data => {
			this.setState({
				references: data['references'],
				loading: false
			})
		})
		.catch(err => console.log(err))

		const categoriesRequest = {
			method: 'GET',
		}

		fetch(this.state.producerCaregoriesEndpoint, categoriesRequest)
		.then(response => response.json())
		.then(data => {
			this.setState({
				categories: data['categories'],
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

	handleCategoryChange = (eventKey) => {
		this.setState({
			category: this.state.categories[eventKey]
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

		if (this.state.currentBook === null || this.state.currentBook === '') {
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
		var startingPage = parseFloat(currentSections[bookName].startingPage)
		var endingPage = parseFloat(currentSections[bookName].endingPage)

		if (!Number.isInteger(startingPage) || !Number.isInteger(endingPage)) {
			this.addError("Pages should be integer numbers")
			return
		}

		if (startingPage < 0 || endingPage < 0) {
			this.addError("Page numbers should be positive numbers")
			return
		}

		if (startingPage > endingPage) {
			debugger
			this.addError("Starting page should be less than the ending page")
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

		if (this.state.category === null || this.state.category === '') {
			this.addError("Please provide a category for the subject")
			return
		}

		if (this.state.title === null || this.state.title === '') {
			this.addError("Please provide a title for the subject")
			return
		}

		if (this.state.description === null || this.state.description === '') {
			this.addError("Please provide a description for the subject")
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

		var reference = {
			title: this.state.title,
			category: this.state.category,
			description: this.state.description,
			books: booksList
		}

		const request = {
			method: 'PUT',
			credentials: 'include',
			body: JSON.stringify(reference)
		}

		fetch(this.state.producerInsertEndpoint, request)
		.then(response => {
			if (!response.ok) {
				if (response.status === 422) {
					this.addError("Something went wrong. Please make sure you follow the instructions on how to create a reference")
				}
				if (response.status === 409) {
					this.addError("This reference already exists. Please try with a different name and description")
				}
			}
			return response.json()
		})
		.then(data => {
			if (data['reference']) {
				var references = this.state.references
				references.push(data['reference'])
				this.setState({
					references: references
				})
			}

			this.clearForm()
		})
		.catch(err => {
			this.addError("Something went wrong. Please try again")
		})
	}

	deleteReference = (reference) => {
		const request = {
			method: 'DELETE',
			credentials: 'include',
			body: JSON.stringify(reference)
		}

		fetch(this.state.producerDeleteEndpoint, request)
		.then(response => response.json())
		.then(data => {
			if (data.deleted) {
				var references = this.state.references
				var filteredReferences = references.filter(function(e) { return e !== reference })
				this.setState({
					references: filteredReferences
				})
			}
		})
		.catch(err => {
			this.addError("Something went wrong. Please try again")
		})

	}

	clearForm = () => {
		this.setState({
			books: {},
			currentBook: "",
			currentSections: {},
			title: "",
			category: "",
			description: "",
		})
	}

	render() {
		const { t } = this.props
		return (
			<Container>
				<Tabs defaultActiveKey="references">
					<Tab eventKey="references" title="My References">
						<Container fluid>
							<Row>
								<Col>
									<br/>
									{this.state.references.length === 0 ? <span>You have no references yet!</span> : null}
								</Col>
							</Row>
							<Row>
								<Col>
									{this.state.loading ? (
										"Loading..."
									) : (
										<ListGroup variant="flush">
											{this.state.references.map((reference, index) => (
												<ListGroup.Item key={index}>
													<Container>
														<Row className="text-right">
															<Col>
																<b>{t('references.categories.' + reference.category)}</b>
															</Col>
														</Row>
														<Row >
															<Col>
																<h4>{reference.title}</h4>
															</Col>
														</Row>
														<br/>
														<Row>
															<Col className="text-left">
																{reference.description}
															</Col>
														</Row>
														<Row>
															<Col>
																<ListGroup>
																{reference.books.map(({ name, book_sections }, bookIndex) => (
																	<ListGroup.Item style={{border: "none"}} key={bookIndex}>
																		<div>
																			<b>{name}</b>
																		</div>
																		<div>
																			{book_sections.map(({ starting_page, ending_page }, sectionsIndex) => (
																				<span key={sectionsIndex}>|{starting_page}-{ending_page}| </span>
																			))}
																		</div>
																	</ListGroup.Item>
																))}
																</ListGroup>
															</Col>
														</Row>
														<Row>
															<Col>
																<Button
																	className="float-right"
																	size="sm"
																	variant="danger"
																	onClick={() => this.deleteReference(reference)}
																>
																	<IoIosTrash/>
																</Button>
															</Col>
														</Row>
													</Container>
													<br/>
												</ListGroup.Item>
											))}
										</ListGroup>
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
								</Alert> : null
							}
						<Form>
							<Form.Row>
								<Form.Group as={Col} controlId="categoryValidation">
									<DropdownButton
										size="sm"
										variant="secondary"
										id="dropdown-basic-button"
										title={this.state.category ? this.state.category : "Category"}
									>
										{this.state.categories.map((category, index) => (
											<Dropdown.Item
												key={index}
												eventKey={index}
												onSelect={(eventKey, event) => this.handleCategoryChange(eventKey)}
											>
												{category.replace("_", " ")}
											</Dropdown.Item>
										))}
									</DropdownButton>
								</Form.Group>
							</Form.Row>

							<Form.Row>
								<Form.Group as={Col} controlId="titleValidation">
									<Form.Control
										required
										type="text"
										onChange={this.handleTitleChange}
										value={this.state.title || ""}
										placeholder="Subject title"
									/>
								</Form.Group>
							</Form.Row>

							<Form.Row>
								<Form.Group as={Col} controlId="descriptionValidation">
									<Form.Control
										required
										as="textarea"
										rows="5"
										value={this.state.description || ""}
										onChange={this.handleDescriptionChange}
										placeholder="Subject description"
									/>
								</Form.Group>
							</Form.Row>

							<Form.Row>
								<Form.Group as={Col} sm="8" md="10">
									<Form.Control
										type="text"
										value={this.state.currentBook || ""}
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
															<Button
																className="float-right"
																size="sm"
																variant="danger"
																onClick={() => this.removeBook(bookName)}
															>
																<IoIosTrash/>
															</Button>
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
							</Form.Row>
						</Form>
					</Tab>
				</Tabs>
			</Container>
		);
	}
}

export default withTranslation()(References);