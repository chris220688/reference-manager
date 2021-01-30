import React from 'react'

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container, Col, Row, } from 'react-bootstrap'

import CustomModal from './CustomModal'
import glogo from '../icons/google_logo.svg'
import mlogo from '../icons/microsoft_logo.svg'
import '../styles/Login.css'


export default function Login(props) {
	const { t } = useTranslation()

	const googleLogin = () => {
		var auth_provider = "google-oidc"
		var login_url = props.producerLoginRedirectEndpoint + "?auth_provider=" + auth_provider
		window.location.href = login_url
	}

	const azureLogin = () => {
		var auth_provider = "azure-oidc"
		var login_url = props.producerLoginRedirectEndpoint + "?auth_provider=" + auth_provider
		window.location.href = login_url
	}

	const header = <Container fluid>
		<Row>
			<Col xs="2"></Col>
			<Col xs="8">
				<div className="login-title">
					<p>
						{t('login.welcome')}
					</p>
				</div>
			</Col>
			<Col xs="2"></Col>
		</Row>
		<Row className="text-center">
			<Col xs="1"></Col>
			<Col xs="10">
			<div>
				<p>
					{t('login.message')}
				</p>
			</div>
			</Col>
			<Col xs="1"></Col>
		</Row>
	</Container>

	const body = <Container fluid>
		<Row>
			<Col xs="1" sm="2"></Col>
			<Col xs="10" sm="8">
				<div className="login-btn-div" onClick={googleLogin}>
					<span>
						<img width="20" height="20" className="login-btn-image" alt="google" src={glogo}/>
					</span>
					<span className="login-btn-text singin-btn">
						{t('login.googlesignin')}
					</span>
				</div>
			</Col>
			<Col xs="1" sm="2"></Col>
		</Row>
		<br/>
		<Row>
			<Col xs="1" sm="2"></Col>
			<Col xs="10" sm="8">
				<div className="login-btn-div" onClick={azureLogin}>
					<span>
						<img width="20" height="20" className="login-btn-image" alt="microsoft" src={mlogo}/>
					</span>
					<span className="login-btn-text singin-btn">
						{t('login.msoftsignin')}
					</span>
				</div>
			</Col>
			<Col xs="1" sm="2"></Col>
		</Row>
		<br/>
	</Container>

	const footer = <div className="login-footer-text">
		<p>
			{t('login.notification.t1')}
			<Link to={'/terms'}>{t('login.notification.t2')}</Link>
			{t('login.notification.t3')}
			<Link to={'/privacy-policy'}>{t('login.notification.t4')}</Link>
		</p>
	</div>

	return (
		<section>
			<CustomModal
				defaultShow={false}
				showBtn={true}
				btnText={t('login.signin')}
				header={header}
				body={body}
				footer={footer}
			/>
		</section>
	)
}