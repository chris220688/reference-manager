import React, { useState, useEffect } from 'react';

import { Button, Col, Container, Form, Row } from 'react-bootstrap'


export default function References(props) {

	const producerInsertEndpoint = props.producerInsertEndpoint
	const producerReferencesEndpoint = props.producerReferencesEndpoint
	const closeReferences = props.closeReferences

	const [data, loading] = useReferences(producerReferencesEndpoint)

	let title = null
	let date = null
	let description = null
	let bookName = null
	let startingPage = null
	let endingPage = null
	let books = []
	let bookSections = []

	const handleTitleChange = (e) => {
		title = e.target.value
	}

	const handleDateChange = (e) => {
		date = e.target.value
	}

	const handleDescriptionChange = (e) => {
		description = e.target.value
	}

	const handleBookChange = (e) => {
		bookName = e.target.value
	}

	const handleStartingPageChange = (e) => {
		startingPage = e.target.value
	}

	const handleEndingPageChange = (e) => {
		endingPage = e.target.value
	}

	const addSection = () => {
		bookSections.push(
			{
				starting_page: startingPage,
				ending_page: endingPage
			}
		)
		startingPage = null
		endingPage = null
	}

	const addBook = () => {
		books.push(
			{
				name: bookName,
				book_sections: bookSections,
			}
		)
		bookName = null
		bookSections = []
	}

	const getValues = () => {
		console.log(title)
		console.log(date)
		console.log(description)
		console.log(bookName)
		console.log(books)
	}

	const addReference = () => {
		var reference = {
			title: title,
			event_date: date,
			description: description,
			books: books
		}

		console.log(reference)

		const putReference = {
			method: 'PUT',
			credentials: 'include',
			body: JSON.stringify(reference)
		}

		fetch(producerInsertEndpoint, putReference)
		.then(response => response.json())
		.then(data => console.log(data))
		.catch(err => console.log(err))
	}

	return (
		<section>
			<Container fluid>
				<Row>
					<Col></Col>
					<Col></Col>
					<Col className="text-right">
						<Button variant="secondary" onClick={closeReferences}>
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
											<Form.Control type="text" onChange={handleTitleChange}/>
										</Form.Group>
										<Form.Group controlId="reference.Date">
											<Form.Label>Event date</Form.Label>
											<Form.Control type="date" onChange={handleDateChange}/>
										</Form.Group>
										<Form.Group controlId="reference.Description">
											<Form.Label>Event description</Form.Label>
											<Form.Control as="textarea" rows="5" onChange={handleDescriptionChange}/>
										</Form.Group>
									</Form>
								</Col>
							</Row>
							<Row  style={{border: '1px solid black' }}>
								<Col>
									<Form.Group controlId="reference.Book">
										<Form.Label>Book name</Form.Label>
										<Form.Control type="text" onChange={handleBookChange}/>
									</Form.Group>
									<Form.Group controlId="reference.StartingPage">
										<Form.Label>Starting page</Form.Label>
										<Form.Control type="number" onChange={handleStartingPageChange}/>
									</Form.Group>
									<Form.Group controlId="reference.EndingPage">
										<Form.Label>Ending page</Form.Label>
										<Form.Control type="number" onChange={handleEndingPageChange}/>
									</Form.Group>
									<Button variant="secondary" onClick={addSection}>
										Add section
									</Button>
									<Button variant="secondary" onClick={addBook}>
										Add book
									</Button>
								</Col>
							</Row>
							<Row>
							<ul>
								{books.map(({ name }, index) => (
									<li key={index}>
										{name}
									</li>
								))}
							</ul>
							</Row>
							<Row className="text-right">
								<Col>
									<Button variant="secondary" onClick={addReference}>
										Add reference
									</Button>
								</Col>
							</Row>
						</Container>
					</Col>
					<Col>
						{loading ? (
							"Loading..."
						) : (
							<ul>
								{data.references.map(({ title }, index) => (
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


function useReferences(url) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchUrl() {
			const request = {
				method: 'GET',
				credentials: 'include',
			}
			const response = await fetch(url, request);
			const json = await response.json();
			setData(json);
			setLoading(false);
		}

		fetchUrl();
	}, [url]);
	return [data, loading];
}
