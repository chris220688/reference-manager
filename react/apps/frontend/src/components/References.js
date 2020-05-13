import React, { Component } from 'react';

import { Button, Col, Container, Form, Row } from 'react-bootstrap'


class References extends Component {

	state = {
		producerInsertEndpoint: this.props.producerInsertEndpoint,
		producerReferencesEndpoint: this.props.producerReferencesEndpoint,
		closeReferences: this.props.closeReferences,
		title: null,
		date: null,
		description: null,
		bookName: null,
		startingPage: null,
		endingPage: null,
		books: [],
		bookSections: [],
		loading: true,
		references: [],
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
			console.log(data['references'])
		})
		.catch(err => console.log(err))
	}

	handleTitleChange = (e) => {
		this.setState({
			title: e.target.value
		})
	}

	handleDateChange = (e) => {
		this.setState({
			date: e.target.value
		})
	}

	handleDescriptionChange = (e) => {
		this.setState({
			description: e.target.value
		})
	}

	handleBookChange = (e) => {
		this.setState({
			bookName: e.target.value
		})
	}

	handleStartingPageChange = (e) => {
		this.setState({
			startingPage: e.target.value
		})
	}

	handleEndingPageChange = (e) => {
		this.setState({
			endingPage: e.target.value
		})
	}

	addSection = () => {
		var bookSections = this.state.bookSections
		bookSections.push(
			{
				starting_page: this.state.startingPage,
				ending_page: this.state.endingPage,
			}
		)

		this.setState({
			bookSections: bookSections,
			startingPage: null,
			endingPage: null
		})

		console.log(this.state.bookSections)
	}

	addBook = () => {
		var books = this.state.books
		books.push(
			{
				name: this.state.bookName,
				book_sections: this.state.bookSections,
			}
		)

		this.setState({
			books: books,
			bookName: null,
			bookSections: []
		})
	}

	addReference = () => {
		var reference = {
			title: this.state.title,
			event_date: this.state.date,
			description: this.state.description,
			books: this.state.books
		}

		const putReference = {
			method: 'PUT',
			credentials: 'include',
			body: JSON.stringify(reference)
		}

		fetch(this.state.producerInsertEndpoint, putReference)
		.then(response => response.json())
		.then(data => {
			var references = this.state.references
			references.push(reference)
			this.setState({
				references: references
			})
		})
		.catch(err => console.log(err))
	}

	render() {
		return (
			<section>
				<Container fluid>
					<Row>
						<Col></Col>
						<Col></Col>
						<Col className="text-right">
							<Button variant="secondary" onClick={this.props.closeReferences}>
								Back
							</Button>
						</Col>
					</Row>
					<Row>
						<Col>
							<Container fluid>
								<Row>
									<Col>
										<Form>
											<Form.Group controlId="reference.Title">
												<Form.Label>Event title</Form.Label>
												<Form.Control type="text" onChange={this.handleTitleChange}/>
											</Form.Group>
											<Form.Group controlId="reference.Date">
												<Form.Label>Event date</Form.Label>
												<Form.Control type="datetime-local" onChange={this.handleDateChange}/>
											</Form.Group>
											<Form.Group controlId="reference.Description">
												<Form.Label>Event description</Form.Label>
												<Form.Control as="textarea" rows="5" onChange={this.handleDescriptionChange}/>
											</Form.Group>
										</Form>
									</Col>
								</Row>
								<Row  style={{border: '1px solid black' }}>
									<Col>
										<Form.Group controlId="reference.Book">
											<Form.Label>Book name</Form.Label>
											<Form.Control type="text" onChange={this.handleBookChange}/>
										</Form.Group>
										<Container fluid>
											<Row>
												<Col>
												<Form.Group controlId="reference.StartingPage">
													<Form.Label>Starting page</Form.Label>
													<Form.Control type="number" onChange={this.handleStartingPageChange}/>
												</Form.Group>
												</Col>
												<Col>
												<Form.Group controlId="reference.EndingPage">
													<Form.Label>Ending page</Form.Label>
													<Form.Control type="number" onChange={this.handleEndingPageChange}/>
												</Form.Group>
												</Col>
											</Row>
										</Container>
										<Button variant="secondary" onClick={this.addSection}>
											Add section
										</Button>
											<ul>
												{this.state.bookSections.map(({ starting_page, ending_page }, index) => (
													<li key={index}>
														{starting_page}-{ending_page}
													</li>
												))}
											</ul>
										<Button variant="secondary" onClick={this.addBook}>
											Add book
										</Button>
									</Col>
								</Row>
								<Row>
								<ul>
									{this.state.books.map(({ name }, index) => (
										<li key={index}>
											{name}
										</li>
									))}
								</ul>
								</Row>
								<Row className="text-right">
									<Col>
										<Button variant="secondary" onClick={this.addReference}>
											Add reference
										</Button>
									</Col>
								</Row>
							</Container>
						</Col>
						<Col>
							{this.state.loading ? (
								"Loading..."
							) : (
								<ul>
									{this.state.references.map(({ title, description }, index) => (
										<li key={index}>
											{title}
										</li>
									))}
								</ul>
							)}
						</Col>
					</Row>
				</Container>
			</section>
		);
	}
}

export default References;