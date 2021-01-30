import React from 'react'

import { useTranslation } from 'react-i18next'
import { Container, Col, Row, } from 'react-bootstrap'

import CustomModal from './CustomModal'
import '../styles/LowContentModal.css'


export default function LowContentModal(props) {
	const { t } = useTranslation()

	const header = <Container fluid>
		<Row>
			<Col xs="2"></Col>
			<Col xs="8">
				<div className="newsletter-section">
					<div className="page-width">
						<div id="confettis">
							<div className="confetti"></div>
							<div className="confetti"></div>
							<div className="confetti"></div>
							<div className="confetti"></div>
							<div className="confetti"></div>
							<div className="confetti"></div>
							<div className="confetti"></div>
							<div className="confetti"></div>
							<div className="confetti"></div>
							<div className="confetti"></div>
						</div>
						<div className="low-content-icon">
							<span role='img' aria-label="partyPopper">🎉</span>
						</div>
						<div className="low-content-title">
							{t('lowcontent.header')}
						</div>
					</div>
				</div>
			</Col>
			<Col xs="2"></Col>
		</Row>
	</Container>

	const body = <div className="low-content-body">
		<p>{t('lowcontent.body.p1')}</p>

		<p><b>{t('lowcontent.body.p2')}</b></p>

		<p>{t('lowcontent.body.p3')}</p>

		<b>{t('lowcontent.body.p4')}</b>
	</div>

	const footer = <div className="low-content-footer">
		{t('lowcontent.footer')}
	</div>

	return (
		<section>
			<CustomModal
				defaultShow={true}
				showBtn={false}
				header={header}
				body={body}
				footer={footer}
			/>
		</section>
	)
}