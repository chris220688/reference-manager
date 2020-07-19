import React, { Component } from 'react';

import { withTranslation } from 'react-i18next'
import { ReactiveBase, ReactiveList, DataSearch, ResultList, ToggleButton } from '@appbaseio/reactivesearch';
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import {
	Button, Col, Container, ListGroup, Pagination, Row
} from 'react-bootstrap'

import '../styles/Search.css'

const { ResultListWrapper } = ReactiveList;


class Search extends Component {

	state = {
		producerCaregoriesEndpoint: this.props.producerCaregoriesEndpoint,
		producerBookmarksEndpoint: this.props.producerBookmarksEndpoint,
		consumerSearchEndpoint: this.props.consumerSearchEndpoint,
		userLoggedIn: this.props.userLoggedIn,
		bookmarkedReferences: [],
		category: null,
		categories: [],
		categoriesStyle: {},
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

		if (this.state.userLoggedIn) {
			this.getBookmarkedReferences()
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.userLoggedIn !== prevProps.userLoggedIn) {
			this.setState({
				"userLoggedIn": this.props.userLoggedIn
			})
			this.getBookmarkedReferences()
		}
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

	getBookmarkedReferences = () => {
		const referencesRequest = {
			method: 'GET',
			credentials: 'include',
		}

		fetch(this.state.producerBookmarksEndpoint, referencesRequest)
		.then(response => response.json())
		.then(data => {
			this.setState({
				bookmarkedReferences: data['bookmarkedReferences'],
			})
		})
		.catch(err => console.log(err))
	}

	addBookmark = (item) => {
		const reference = {
			reference_id: item.reference_id,
			title: item.title,
			category: item.category,
			description: item.description,
			books: item.books,
		}

		const addBookmarkRequest = {
			method: 'PUT',
			credentials: 'include',
			body: JSON.stringify(reference)
		}

		fetch(this.state.producerBookmarksEndpoint, addBookmarkRequest)
		.then(response => response.json())
		.then(data => {
			if ( data.success ) {
				var bookmarkedReferences = this.state.bookmarkedReferences
				bookmarkedReferences.push(reference)
				this.setState({
					bookmarkedReferences: bookmarkedReferences,
				})
			}
		})
		.catch(err => console.log(err))
	}

	removeBookmark = (item) => {
		const reference = {
			reference_id: item.reference_id,
			title: item.title,
			category: item.category,
			description: item.description,
			books: item.books,
		}

		const deleteBookmarkRequest = {
			method: 'DELETE',
			credentials: 'include',
			body: JSON.stringify(reference)
		}

		fetch(this.state.producerBookmarksEndpoint, deleteBookmarkRequest)
		.then(response => response.json())
		.then(data => {
			if ( data.success ) {
				var bookmarkedReferences = this.state.bookmarkedReferences
				var filteredBookmarkedReferences = bookmarkedReferences.filter(
					function(e) { return e.reference_id !== reference.reference_id }
				)

				this.setState({
					bookmarkedReferences: filteredBookmarkedReferences,
				})
			}
		})
		.catch(err => console.log(err))
	}

	render() {
		const { t } = this.props
		return (
			<section>
				<ReactiveBase
					app="referencemanager"
					url={this.state.consumerSearchEndpoint}
				>
					<div>
						<Row>
							<Col xs="12" sm="12" md="12" lg="3">
								<div className="responsive-text">
									<Row>
										<Col sm="1"></Col>
										<Col sm="10">
											<div className="toggle-categories-btn">
												<Button size="sm" variant="outline-dark" onClick={this.toggleCategories}>{t('search.categories')}</Button>
											</div>
										</Col>
										<Col sm="1"></Col>
									</Row>
									<Row>
										<Col xs="2" sm="2" md="1"></Col>
										<Col xs="8" sm="8" md="10">
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
										<Col xs="2" sm="2" md="1"></Col>
									</Row>
								</div>
							</Col>
							<Col xs="12" sm="12" md="12" lg="7">
								<div className="responsive-text">
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
											size={10}
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
															<ResultList key={index} style={{borderLeft: "none", borderRight: "none", borderTop: "none", "padding": "unset", "paddingTop": "10px"}}>
																<ResultList.Content>
																	<ResultList.Title>
																		<Row>
																			{this.state.userLoggedIn ?
																				<Col>
																					{this.state.bookmarkedReferences.map(ref => ref.reference_id).indexOf(item.reference_id) === -1 ?
																						<BsBookmark style={{"cursor": "pointer"}} onClick={() => this.addBookmark(item)}/> :
																						<BsBookmarkFill style={{"cursor": "pointer"}} onClick={() => this.removeBookmark(item)}/>
																					}
																				</Col> : null
																			}
																			<Col className="text-right">
																				{t('search.categories.' + item.category)}
																			</Col>
																		</Row>
																	</ResultList.Title>
																	<ResultList.Description>
																		<div>
																			<h2 className="results-title" style={{"paddingTop": "10px"}}>{item.title}</h2>
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
																		</div>
																	</ResultList.Description>
																</ResultList.Content>
															</ResultList>
														))
													}
												</ResultListWrapper>
											)}
										/> : null
									}
								</div>
							</Col>
							<Col xs="12" sm="12" md="12" lg="2"></Col>
						</Row>
					</div>
				</ReactiveBase>
			</section>
		)
	}
}

export default withTranslation()(Search);