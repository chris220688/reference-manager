import React, { Component } from 'react';

import { withTranslation } from 'react-i18next'
import { FaQuoteLeft } from "react-icons/fa";

import {
	Col, Container, Row
} from 'react-bootstrap'

import '../styles/Home.css'
import logo from '../icons/logo-black.png'

import elasticsearch from '../icons/elasticsearch.png'
import fastapi from '../icons/fastapi.png'
import react from '../icons/react.png'
import reactivesearch from '../icons/reactivesearch.png'
import mongo from '../icons/mongo.png'


class Home extends Component {

	render() {
		const { t } = this.props
		return (
			<div className="main-component">

				<Row className="first-row">
					<Col className="d-xs-none d-sm-none d-md-none d-xl-block" xl="1"></Col>

					<Col xs="12" sm="12" md="12" xl="3">
						<div className="first-row-left vertical-align">
							<span>
								A social friendly search engine for books, powered by the users!
							</span>
						</div>
					</Col>

					<Col xs="12" sm="12" md="12" xl="4">
						<div className="first-row-middle vertical-align">
							<img
								src={logo}
								className="centered-image"
								alt="logo"
							/>
						</div>
					</Col>

					<Col xs="12" sm="12" md="12" xl="3">
						<div className="first-row-right vertical-align">
							<span>
								Read a book, write down the highlights and share it with the rest of the world
							</span>
						</div>
					</Col>

					<Col className="d-xs-none d-sm-none d-md-none d-xl-block" xl="1" ></Col>
				</Row>

				<Row className="second-row">
					<Col xs="1" sm="1" md="3" xl="4"></Col>
					<Col xs="10" sm="10" md="6" xl="4">
						<div className="second-row-middle vertical-align">
				            <div className="mx-auto">
				                <blockquote className="blockquote blockquote-custom bg-white p-5 rounded">
				                    <div className="blockquote-custom-icon bg-info"><FaQuoteLeft/></div>
				                    <p className="">
				                    	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna aliqua. 
				                    </p>
				                </blockquote>
				            </div>
						</div>
					</Col>
					<Col xs="1" sm="1" md="3" xl="4"></Col>
				</Row>
				<Container>
				<Row className="third-row">
					<Col xs="12" sm="12" md="12" xl="4">
						<div className="vertical-align">
							<img
								src={reactivesearch}
								className="reactivesearch-icon"
								alt="logo"
							/>
						</div>
					</Col>
					<Col xs="12" sm="12" md="12" xl="4">
						<div className="vertical-align">
							<img
								src={fastapi}
								className="fastapi-icon"
								alt="logo"
							/>

						</div>
					</Col>
					<Col xs="12" sm="12" md="12" xl="4">
						<div className="vertical-align">
							<img
								src={mongo}
								className="mongo-icon"
								alt="logo"
							/>

						</div>
					</Col>
				</Row>
				</Container>
				<Container>
				<Row className="fourth-row">
					<Col className="d-xs-none d-sm-none d-md-none d-xl-block" xl="2"></Col>
					<Col xs="12" sm="12" md="12" xl="4">
						<div className="vertical-align">
							<img
								src={react}
								className="react-icon"
								alt="logo"
							/>
						</div>
					</Col>
					<Col xs="12" sm="12" md="12" xl="4">
						<div className="vertical-align">
							<img
								src={elasticsearch}
								className="elasticsearch-icon"
								alt="logo"
							/>
						</div>
					</Col>
					<Col className="d-xs-none d-sm-none d-md-none d-xl-block" xl="2"></Col>
				</Row>
				</Container>
			</div>
		)
	}
}

export default withTranslation()(Home);