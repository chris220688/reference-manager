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
		.then(data => this.setCategories(data))
		.catch(err => console.log(err))
	}

	setCategories = (data) => {
		var categories = []

		data['categories'].forEach(category => {
			categories.push(category)
		})

		this.setState({
			categories: categories,
		})
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
		const { t } = this.props
		var books = this.state.books

		if (this.state.currentBook === null || this.state.currentBook === '') {
			this.addError(t("references.form.error.bookname"))
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
		const { t } = this.props
		var books = this.state.books
		var currentBook = books[bookName]

		var currentSections = this.state.currentSections
		var startingPage = parseFloat(currentSections[bookName].startingPage)
		var endingPage = parseFloat(currentSections[bookName].endingPage)

		if (!Number.isInteger(startingPage) || !Number.isInteger(endingPage)) {
			this.addError(t('references.form.error.pagenumber'))
			return
		}

		if (startingPage < 0 || endingPage < 0) {
			this.addError('references.form.error.pagepositivenumber')
			return
		}

		if (startingPage > endingPage) {
			debugger
			this.addError(t('references.form.error.startingpagegt'))
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
		const { t } = this.props
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		}

		if (this.state.category === null || this.state.category === '') {
			this.addError(t('references.form.error.category'))
			return
		}

		if (this.state.title === null || this.state.title === '') {
			this.addError(t('references.form.error.title'))
			return
		}

		if (this.state.description === null || this.state.description === '') {
			this.addError(t('references.form.error.description'))
			return
		}

		if (this.state.description.length < 30) {
			this.addError(t('references.form.error.desctiptionsize'))
			return
		}

		if (Object.keys(this.state.books).length === 0) {
			this.addError(t('references.form.error.book'))
			return
		}

		var booksList = []
		for (const [ name, sections ] of Object.entries(this.state.books)) {

			if (sections.length === 0) {
				this.addError(t('references.form.error.section'))
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
					this.addError(t('references.form.error.genericerror'))
				}
				if (response.status === 409) {
					this.addError(t('references.form.error.referenceexists'))
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
			this.addError(t('references.error.genericerror'))
		})
	}

	deleteReference = (reference) => {
		const { t } = this.props
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
			this.addError(t('references.error.genericerror'))
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
				<Tabs defaultActiveKey="references" className="reference-tabs">
					<Tab eventKey="references" title={t('references.myreferences')}>
						<Container fluid>
							<Row>
								<Col>
									<br/>
									{this.state.references.length === 0 ? <span>{t('references.noreferences')}</span> : null}
								</Col>
							</Row>
							<Row>
								<Col>
									{this.state.loading ? (
										t('references.loading')
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

					<Tab eventKey="addReference" title={t('references.addreference')}>
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
										title={this.state.category ? this.state.category : t('references.form.category')}
									>
										{this.state.categories.map((category, index) => (
											<Dropdown.Item
												key={index}
												eventKey={index}
												onSelect={(eventKey, event) => this.handleCategoryChange(eventKey)}
											>
												{t('search.categories.' + category)}
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
										placeholder={t('references.form.title')}
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
										placeholder={t('references.form.description')}
									/>
								</Form.Group>
							</Form.Row>

							<Form.Row>
								<Form.Group as={Col} sm="8" md="10">
									<Form.Control
										type="text"
										value={this.state.currentBook || ""}
										onChange={this.handleBookChange}
										placeholder={t('references.form.booktitle')}
									/>
								</Form.Group>

								<div as={Col} sm="4" md="2">
									<Button variant="link" onClick={this.addBook}>{t('references.form.addbook')}</Button>
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
															<b>{t('references.form.book')}:</b> {bookName}
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
															<div className="limited-text"><b>{t('references.form.pages')}: </b>
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
															placeholder={t('references.form.startingpage')}
														/>
													</Form.Group>

													<Form.Group as={Col} sm="4" md="2" controlId="endingPageValidation">
														<Form.Control
															type="number"
															min="0"
															value={this.state.currentSections[bookName].endingPage}
															onChange={(event) => this.handleEndingPageChange(event, bookName)}
															placeholder={t('references.form.endinggpage')}
														/>
													</Form.Group>

													<div as={Col} sm="4" md="2">
														<Button variant="link" onClick={() => this.addSection(bookName)}>{t('references.form.addsection')}</Button>
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
									<Button size="sm" variant="outline-dark" onClick={this.addReference}>{t('references.form.save')}</Button>
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