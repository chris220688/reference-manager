import React, { Component } from 'react';
import { ReactiveBase, ReactiveList, DataSearch, ResultList, ToggleButton } from '@appbaseio/reactivesearch';

import {
	Col, Container, ListGroup, Row
} from 'react-bootstrap'

const { ResultListWrapper } = ReactiveList;


class Search extends Component {

	state = {
		producerCaregoriesEndpoint: process.env.REACT_APP_PRODUCER_CATEGORIES_ENDPOINT,
		consumerSearchEndpoint: process.env.REACT_APP_CONSUMER_SEARCH_ENDPOINT,
		category: null,
		categories: []
	}

	componentDidMount() {
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
			const label = category.replace("_", " ")
			categories.push(
				{ label: label, value: category }
			)
		})

		this.setState({
			categories: categories,
		})
	}

	render() {
		return (
			<section>
			<ReactiveBase
				app="referencemanager"
				url={this.state.consumerSearchEndpoint}
			>

			<div className="col">
				<ToggleButton
					componentId="categoryFilter"
					dataField="category"
					data={this.state.categories}
				/>
			</div>

				<DataSearch
					componentId="searchBox"
					dataField={["title"]}
					queryFormat="or"
					placeholder="Search"
					debounce={100}
					fuzziness="AUTO"
					showFilter={true}
					react={{
						"and": ["categoryFilter",]
					}}
				/>

				<ReactiveList
					dataField="title"
					react={{
						"and": ["searchBox", "categoryFilter"]
					}}
					componentId="searchResult"
					pagination={true}
					size={20}
					render={({ data }) => (
						<ResultListWrapper>
							{
								data.map((item, index) => (
									<ResultList key={index}>
										<ResultList.Content>
											<ResultList.Title>
											{item.title}
											</ResultList.Title>
											<ResultList.Description>
												<Container>
													<Row className="text-right">
														<Col>
															<b>{item.category}</b>
														</Col>
													</Row>
													<br/>
													<Row>
														<Col className="text-left">
															{item.description}
														</Col>
													</Row>
													<Row>
														<Col>
															<ListGroup>
															{item.books.map(({ name, book_sections }, index) => (
																<ListGroup.Item style={{border: "none"}} key={index}>
																	<div>
																		<b>{name}</b>
																	</div>
																	<div>
																		{book_sections.map(({ starting_page, ending_page }, index) => (
																			<span key={index}>|{starting_page}-{ending_page}| </span>
																		))}
																	</div>
																</ListGroup.Item>
															))}
															</ListGroup>
														</Col>
													</Row>
												</Container>
											</ResultList.Description>
										</ResultList.Content>
									</ResultList>
								))
							}
						</ResultListWrapper>
					)}/>
			</ReactiveBase>
			</section>
		)
	}
}

export default Search;