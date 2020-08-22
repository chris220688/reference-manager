import React, { Component } from 'react';

import { withTranslation } from 'react-i18next'
import { ReactiveBase, ReactiveList, DataSearch, ResultList, ToggleButton } from '@appbaseio/reactivesearch';
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import {
	Button, Col, Container, ListGroup, Pagination, Row
} from 'react-bootstrap'

import '../styles/Search.css'
import amazonLogo from '../icons/amazon.png'
import bookdepositoryLogo from '../icons/bookdepository.svg'

const { ResultListWrapper } = ReactiveList;


class Search extends Component {

	state = {
		producerCaregoriesEndpoint: this.props.producerCaregoriesEndpoint,
		producerBookmarksEndpoint: this.props.producerBookmarksEndpoint,
		producerRateReferenceEndpoint: this.props.producerRateReferenceEndpoint,
		consumerSearchEndpoint: this.props.consumerSearchEndpoint,
		userData: this.props.userData,
		bookmarkedReferences: this.props.userData.bookmarkedReferences,
		ratedReferences: this.props.userData.ratedReferences,
		countNumRefs: {},
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
	}

	componentDidUpdate(prevProps) {
		if (this.props.userData !== prevProps.userData) {
			this.setState({
				"userData": this.props.userData,
			})
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

	addBookmark = (reference_id) => {
		const reference = {
			reference_id: reference_id,
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
				var bookmarkedReferences = this.props.userData.bookmarkedReferences
				bookmarkedReferences.push(reference_id)
				this.setState({
					bookmarkedReferences: bookmarkedReferences,
				})
			}
		})
		.catch(err => console.log(err))
	}

	removeBookmark = (reference_id) => {
		const reference = {
			reference_id: reference_id,
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
					ref_id => ref_id !== reference_id
				)

				this.setState({
					bookmarkedReferences: filteredBookmarkedReferences,
				})
			}
		})
		.catch(err => console.log(err))
	}

	rateReference = (referenceId, rateOption) => {
		if (!this.props.userData.userLoggedIn) {
			return
		}

		const request = {
			reference_id: referenceId,
			rate_option: rateOption,
		}

		const rateOptionRequest = {
			method: 'PUT',
			credentials: 'include',
			body: JSON.stringify(request)
		}

		fetch(this.state.producerRateReferenceEndpoint, rateOptionRequest)
		.then(response => response.json())
		.then(data => {
			if (data['success']) {

				var ratedReferences = this.state.ratedReferences
				var likesCount = parseInt(this.state.countNumRefs['thumbs_up-' + referenceId].innerText)
				var dislikesCount = parseInt(this.state.countNumRefs['thumbs_down-' + referenceId].innerText)

				if (referenceId in ratedReferences) {
					if (ratedReferences[referenceId] === rateOption) {
						if (rateOption === 'thumbs_up') {
							likesCount = likesCount - 1
						} else if (rateOption === 'thumbs_down') {
							dislikesCount = dislikesCount - 1
						}

						delete ratedReferences[referenceId]
					} else {
						if (ratedReferences[referenceId] === 'thumbs_up' && rateOption === 'thumbs_down') {
							likesCount = likesCount - 1
							dislikesCount = dislikesCount + 1
						} else {
							likesCount = likesCount + 1
							dislikesCount = dislikesCount - 1
						}
						ratedReferences[referenceId] = rateOption
					}
				} else {
					if (rateOption === 'thumbs_up') {
						likesCount = likesCount + 1
					} else if (rateOption === 'thumbs_down') {
						dislikesCount = dislikesCount + 1
					}
					ratedReferences[referenceId] = rateOption
				}

				// Change the html span element that contains the total likes/dislikes
				var likesSpan = this.state.countNumRefs['thumbs_up-' + referenceId]
				likesSpan.innerText = likesCount
				var dislikesSpan = this.state.countNumRefs['thumbs_down-' + referenceId]
				dislikesSpan.innerText = dislikesCount

				this.setState({
					ratedReferences: ratedReferences,
				})

			}
		})
		.catch(err => console.log(err))
	}

	setRefAttr = (referenceId, ref, prefix) => {
		var countNumRefs = this.state.countNumRefs
		countNumRefs[prefix + referenceId] = ref
	}

	getLinkSource = (linkType) => {
		if (linkType === "amazon") return amazonLogo
		if (linkType === "bookdepository") return bookdepositoryLogo
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
																			{this.props.userData.userLoggedIn ?
																				<Col>
																					{this.state.bookmarkedReferences.indexOf(item.reference_id) === -1 ?
																						<BsBookmark style={{"cursor": "pointer"}} onClick={() => this.addBookmark(item.reference_id)}/> :
																						<BsBookmarkFill style={{"cursor": "pointer"}} onClick={() => this.removeBookmark(item.reference_id)}/>
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
																					{item.books.map(({ name, author, book_sections, book_links }, index) => (
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
																							<div className="text-right">
																								{book_links.map(({ link_type, link_url }, index) => (
																									<a href={link_url}>
																										<img
																											src={this.getLinkSource(link_type)}
																											className={link_type}
																											alt={link_type}
																										/>
																									</a>
																								))}
																							</div>
																							<div className="text-right">
																								<span style={{marginRight: "10px"}}>
																									{this.state.ratedReferences && item.reference_id in this.state.ratedReferences && this.state.ratedReferences[item.reference_id] === 'thumbs_up' ?
																										<span>
																											<FiThumbsUp
																												style={{"cursor": "pointer", "fill": "black"}}
																												onClick={(e) => this.rateReference(item.reference_id, "thumbs_up")}
																											/> <span ref={(ref) => this.setRefAttr(item.reference_id, ref, "thumbs_up-")}>{item.rating.positive}</span>
																										</span> :
																										<span>
																											<FiThumbsUp
																												style={{"cursor": "pointer", "fill": "white"}}
																												onClick={(e) => this.rateReference(item.reference_id, "thumbs_up")}
																											/> <span ref={(ref) => this.setRefAttr(item.reference_id, ref, "thumbs_up-")}>{item.rating.positive}</span>
																										</span>
																									}
																								</span>
																								<span>
																									{this.state.ratedReferences && item.reference_id in this.state.ratedReferences && this.state.ratedReferences[item.reference_id] === 'thumbs_down' ?
																										<span>
																											<FiThumbsDown
																												style={{"cursor": "pointer", "fill": "black"}}
																												onClick={(e) => this.rateReference(item.reference_id, "thumbs_down")}
																											/> <span ref={(ref) => this.setRefAttr(item.reference_id, ref, "thumbs_down-")}>{item.rating.negative}</span>
																										</span> :
																										<span>
																											<FiThumbsDown
																												style={{"cursor": "pointer", "fill": "white"}}
																												onClick={(e) => this.rateReference(item.reference_id, "thumbs_down")}
																											/> <span ref={(ref) => this.setRefAttr(item.reference_id, ref, "thumbs_down-")}>{item.rating.negative}</span>
																										</span>
																									}
																								</span>
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