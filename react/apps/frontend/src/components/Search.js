import React, { Component } from 'react';

import { withTranslation } from 'react-i18next'
import { ReactiveBase, ReactiveList, DataSearch, ResultList, ToggleButton } from '@appbaseio/reactivesearch';

import {
	Button, Col, Container, ListGroup, Pagination, Row
} from 'react-bootstrap'

import '../styles/Search.css'

const { ResultListWrapper } = ReactiveList;


class Search extends Component {

	state = {
		producerCaregoriesEndpoint: this.props.producerCaregoriesEndpoint,
		consumerSearchEndpoint: this.props.consumerSearchEndpoint,
		category: null,
		categories: [],
		categoriesStyle: {display: 'none'},
		showSearchResults: false,
	}

	componentDidMount() {
		const categoriesRequest = {
			method: 'GET'
		}

		fetch(this.state.producerCaregoriesEndpoint, categoriesRequest)
		.then(response => response.json())
		.then(data => this.setCategories(data))
		.catch(err => console.log(err))
	}

	setCategories = (data) => {
		var categories = []
		const { t } = this.props

		data['categories'].forEach(category => {
			categories.push(
				{label: t('search.categories.' + category), value: category}
			)
		})

		this.setState({
			categories: categories,
		})
	}

	toggleCategories = () => {
		if (Object.keys(this.state.categoriesStyle).length === 0) {
			this.setState({
				categoriesStyle: {display: 'none'},
			})
		} else {
			this.setState({
				categoriesStyle: {},
			})
		}
	}

	handleSearchBarResults = (value, causes) => {
		if (
			value && (
				causes === "SUGGESTION_SELECT" ||
				causes === "ENTER_PRESS" ||
				causes === "SEARCH_ICON_CLICK"
			)
		) {
			this.setState({
				showSearchResults: true
			})
		} else {
			this.setState({
				showSearchResults: false
			})
		}
	}

	handleSearchCategoryResults = (value) => {
		if (value.length > 0) {
			this.setState({
				showSearchResults: true
			})
		} else {
			this.setState({
				showSearchResults: false
			})
		}
	}

	render() {
		const { t } = this.props
		return (
			<section>
				<ReactiveBase
					app="referencemanager"
					url={this.state.consumerSearchEndpoint}
				>
					<Container className="responsive-text">
						<Row>
							<Col sm="2"></Col>
							<Col sm="8">
								<div className="toggle-categories-btn">
									<Button size="sm" variant="outline-dark" onClick={this.toggleCategories}>{t('search.categories')}</Button>
								</div>
							</Col>
							<Col sm="2"></Col>
						</Row>
						<Row>
							<Col xs="3" sm="3" md="4"></Col>
							<Col xs="6" sm="6" md="4">
								<div className="toggle-categories-btn">
									<ToggleButton
										componentId="categoryFilter"
										dataField="category"
										data={this.state.categories}
										className="search-toggle"
										style={this.state.categoriesStyle}
										onValueChange={(value) => this.handleSearchCategoryResults(value)}
									/>
								</div>
							</Col>
							<Col xs="3" sm="3" md="4"></Col>
						</Row>
					</Container>

					<Container className="responsive-text">
						<DataSearch
							componentId="searchBox"
							dataField={["title"]}
							queryFormat="or"
							placeholder={t('search.searchbar')}
							debounce={100}
							fuzziness="AUTO"
							showFilter={true}
							innerClass={{
								input: 'searchbar-input',
								list: 'searchbar-list',
							}}
							react={{
								"and": ["categoryFilter",]
							}}
							onValueSelected={(value, cause, source) => this.handleSearchBarResults(value, cause)}
						/>

						{this.state.showSearchResults ?
							<ReactiveList
								dataField="title"
								react={{
									"and": ["searchBox", "categoryFilter"]
								}}
								componentId="searchResult"
								pagination={true}
								size={5}
								renderResultStats={(stats) => {
									return (
										<Container>
											<Row>
												<Col sm="2"></Col>
												<Col sm="8" className="search-stats">
													<span>{t('search.results.stats', {numberOfResults: stats.numberOfResults, time: stats.time})}</span>
												</Col>
												<Col sm="2"></Col>
											</Row>
											<br/>
										</Container>
									)
								}}
								renderPagination={({ pages, totalPages, currentPage, setPage, fragmentName }) => {
									let active = currentPage
									let items = []
									for (let number = 1; number <= totalPages; number++) {

										if (number === 1) {
											items.push(
												<Pagination.Item key={number-1} active={number-1 === active} onClick={() => setPage(parseInt(number-1, 10))}>
													{number}
												</Pagination.Item>
											)
											if (currentPage > 2) {
												items.push(<Pagination.Ellipsis disabled />)
											}
										}

										if (
											(number === currentPage || number === currentPage+1 || number === currentPage+2) &&
											number !== 1 && number !== totalPages
										) {
											items.push(
												<Pagination.Item key={number-1} active={number-1 === active} onClick={() => setPage(parseInt(number-1, 10))}>
													{number}
												</Pagination.Item>,
											)
										}

										if (number === totalPages && number !== 1) {
											if (currentPage+1 < totalPages-2) {
												items.push(<Pagination.Ellipsis disabled />)
											}

											items.push(
												<Pagination.Item key={number-1} active={number-1 === active} onClick={() => setPage(parseInt(number-1, 10))}>
													{number}
												</Pagination.Item>
											)
										}
									}

									return (
										<Container>
											<Row>
												<Col></Col>
												<Col className="custom-pagination">
													<Pagination>
														{items}
													</Pagination>
												</Col>
												<Col></Col>
											</Row>
										</Container>
									)
								}}
								render={({ data }) => (
									<ResultListWrapper>
										{
											data.map((item, index) => (
												<ResultList key={index}>
													<ResultList.Content>
														<ResultList.Title>
															<Row className="text-right">
																<Col>
																	{t('search.categories.' + item.category)}
																</Col>
															</Row>
														</ResultList.Title>
														<ResultList.Description>
															<Container>
																<h2>{item.title}</h2>
																<br/>
																<Row>
																	<Col className="text-left">
																		<span>
																			{item.description}
																		</span>
																	</Col>
																</Row>
																<Row>
																	<Col>
																		<ListGroup>
																		{item.books.map(({ name, author, book_sections }, index) => (
																			<ListGroup.Item style={{border: "none"}} key={index}>
																				<div>
																					<span><b>{name}</b></span> - <span>{author}</span>
																				</div>
																				<div>
																					<span>{t('references.form.pages')}: </span>
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
								)}
							/> : null
						}
					</Container>
				</ReactiveBase>
			</section>
		)
	}
}

export default withTranslation()(Search);