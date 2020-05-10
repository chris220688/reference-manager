import React, { useState, useEffect } from 'react';

import { Button, Form } from 'react-bootstrap'


var testReference = {
	title: "The battle of the Waterloo",
	event_date: "1780-05-18T16:00:00Z",
	description: "A battle between France and England, A battle between France and England",
	books: [
		{
			name: "Book of English literature",
			book_sections: [
				{
					starting_page: 2,
					ending_page: 3
				}
			]
		},
		{
			name: "Another book",
			book_sections: [
				{
					starting_page: 7,
					ending_page: 8
				}
			]
		}
	],
	rating: 5
}

export default function References(props) {

	const producerInsertEndpoint = props.producerInsertEndpoint
	const producerReferencesEndpoint = props.producerReferencesEndpoint
	const closeReferences = props.closeReferences

	const [data, loading] = useReferences(producerReferencesEndpoint)

	const addReference = () => {

		const putReference = {
			method: 'PUT',
			credentials: 'include',
			body: JSON.stringify(testReference)
		}

		fetch(producerInsertEndpoint, putReference)
		.then(response => response.json())
		.then(data => console.log(data))
		.catch(err => console.log(err))
	}

	return (
		<section>
			<Button variant="secondary" onClick={closeReferences}>
				Back
			</Button>

			<Button variant="secondary" onClick={addReference}>
				Add reference
			</Button>

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
