import React, { Component } from 'react';

import { withTranslation } from 'react-i18next'

import { Container } from 'react-bootstrap'


class PrivacyPolicy extends Component {

	render() {
		const { t } = this.props
		return (
			<Container>
				<h1>PRIVACY NOTICE</h1>

				<h2>Last Updated 07 June  2020</h2>

				<p>
					Thank you for choosing to be part of our community. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at {this.props.emailContact}.
				</p>
				<p>
					When you visit our and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we describe our privacy policy. We seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important. If there are any terms in this privacy policy that you do not agree with, please discontinue use of our and our services.
				</p>
				<p>
					This privacy policy applies to all information collected through our and/or any related services, sales, marketing or events (we refer to them collectively in this privacy policy as the "Sites"). 
				</p>
				<p>
					Please read this privacy policy carefully as it will help you make informed decisions about sharing your personal information with us.  
				</p>

				<div>
					<h3>1. What information we collect?</h3>

					<h4>Personal information you disclose to us.</h4>
					<p>
						In Short: We may collect personal information that you provide to us such as name, address, contact information and security data.
					</p>
					<p>
						We collect personal information that you voluntarily provide to us when registering at {this.props.domainName} or otherwise contacting us.
					</p>

					<p>
						The personal information we collect can include the following:
						<ul>
							<li>
								<p>
									Name and Contact Data. We collect your first name in order to personalise the user interface experience.
								</p>
							</li>
							<li>
								<p>
									Credentials and Social Media Login Data. We do not collect passwords, password hints, or similar security information. As a user, you are prompted to sign in using one of the available external authentication providers. We do however collect your personal id (known as sub_id) that is provided to us by any of the above authentication providers, in order to register you in our system and make it possible to authenticate you and grant you access in your future visits in our website.
								</p>
							</li>
						</ul>
					</p>
					<p>
						All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information.  
					</p>

					<h4>Information automatically collected</h4>
					<p>
						In Short: Some information – such as IP address and/or browser and device characteristics – is collected automatically when you visit {this.props.domainName}.
					</p>
					<p>
						We automatically collect certain information when you visit, use or navigate the website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our and other technical information. This information is primarily needed to maintain the security and operation of our website, and for our internal analytics and reporting purposes.
					</p>
				</div>

				<div>
					<h3>2. Will your information be shared with anyone?</h3>

					<p>
						In Short: We only share information with your consent, to comply with laws, to protect your rights, or to fullfill business obligations.   
					</p>

					<p>
						We may process or share data based on the following legal basis:
						<ul>
							<li>
								<p>
									Consent: We may process your data if you have given us specific consent to use your personal information in a specific purpose.
								</p>
							</li>
							<li>
								<p>
									Legitimate Interests: We may process your data when it is reasonably necessary to achieve our legitimate business interests. 
								</p>
							</li>
							<li>
								<p>
									Performance of a Contract: Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract. 
								</p>
							</li>
							<li>
								<p>
									Legal Obligations: We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process, such as in response to a court order or a subpoena (including in response to public authorities to meet national security or law enforcement requirements). 
								</p>
							</li>
							<li>
								<p>
									Vital Interests: We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.
								</p>
							</li>
						</ul>
					</p>

					<p>
						More specifically, we may need to process your data or share your personal information in the following situations:   
						<ul>
							<li>
								<p>
									Third-Party Advertisers. We may use third-party advertising companies to serve ads when you visit {this.props.domainName}. These companies may use information about your visits to our Website(s) and other websites that are contained in web cookies and other tracking technologies in order to provide advertisements about goods and services of interest to you.
								</p>
							</li>
							<li>
								<p>
									Affiliates. We may share your information with our affiliates, in which case we will require those affiliates to honor this privacy policy. Affiliates include our parent company and any subsidiaries, joint venture partners or other companies that we control or that are under common control with us.      
								</p>
							</li>
							<li>
								<p>
									Business Partners. We may share your information with our business partners to offer you certain products, services or promotions.   
								</p>
							</li>
						</ul>
					</p>
				</div>

				<div>
					<h3>3. Do we use cookies and other tracking technologies?</h3>

					<p>
						In Short: We may use cookies and other tracking technologies to collect and store your information.
					</p>
					<p>
						We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.
					</p>
				</div>


				<div>
					<h3>4. How do we handle social logins?</h3>

					<p>
						In Short: If you choose to register or log in to our websites using a social media account, we may have access to certain information about you.
					</p>
					<p>
						We offer you the ability to register and login using your third party social media account details (like your Google or Microsoft logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile Information we receive may vary depending on the social media provider concerned, but will often include your name, e-mail address, profile picture as well as other information you choose to make public.
					</p>
					<p>
						We will use the information we receive only for the purposes that are described in this privacy policy or that are otherwise made clear to you. Please note that we do not control, and are not responsible for other uses of your personal information by your third party social media provider. We recommend that you review their privacy policy to understand how they collect, use and share your personal information, and how you can set your privacy preferences on their sites and apps.
					</p>
				</div>

				<div>
					<h3>5. Is your information transferred internationally?</h3>

					<p>
						In Short: We may transfer, store, and process your information in countries other than your own.
					</p>
					<p>
						Our servers are located in {this.props.serversLocation}. If you are accessing our from outside, please be aware that your information may be transferred to, stored, and processed by us in our facilities and by those third parties with whom we may share your personal information (see "Will your information be shared with anyone?" above), in and other countries.
					</p>
					<p>
						If you are a resident in the European Economic Area, then these countries may not have data protection or other laws as comprehensive as those in your country. We will however take all necessary measures to protect your personal information in accordance with this privacy policy and applicable law.
					</p>
				</div>

				<div>
					<h3>6. What is our stance on third-party websites?</h3>

					<p>
						In Short: We are not responsible for the safety of any information that you share with third-party providers who advertise, but are not affiliated with, our websites.  
					</p>
					<p>
						We may contain advertisements from third parties that are not affiliated with us and which may link to other websites, online services or mobile applications. We cannot guarantee the safety and privacy of data you provide to any third parties. Any data collected by third parties is not covered by this privacy policy. We are not responsible for the content or privacy and security practices and policies of any third parties, including other websites, services or applications that may be linked to or from the . You should review the policies of such third parties and contact them directly to respond to your questions.
					</p>
				</div>

				<div>
					<h3>7. How long do we keep your information?</h3>

					<p>
						In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this privacy policy unless otherwise required by law.  
					</p>
					<p>
						We will keep your personal information for as long as you keep your account open, in order to be able to authenticate you and grant you access to your account.
					</p>
					<p>
						You can chose to delete your account anytime by contacting us at {this.props.emailContact} or by following the instructions in your account settings.
					</p>
				</div>

				<div>
					<h3>8. How do we keep your information safe?</h3>

					<p>
						In Short: We aim to protect your personal information through a system of organizational and technical security measures.
					</p>
					<p>
						We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our is at your own risk. You should only access the services within a secure environment.
					</p>
				</div>

				<div>
					<h3>9. Do we collect information from minors?</h3>

					<p>
						In Short: We do not knowingly collect data from or market to children under 18 years of age.
					</p>
					<p>
						We do not knowingly solicit data from or market to children under 18 years of age. By using {this.props.domainName}, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the {this.props.domainName}. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we have collected from children under age 18, please contact us at {this.props.emailContact}.
					</p>
				</div>

				<div>
					<h3>10. What are your privacy rights?</h3>

					<p>
						In Short: In some regions, such as the European Economic Area, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.
					</p>
					<p>
						In some regions (like the European Economic Area), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. To make such a request, please use the contact details provided below. We will consider and act upon any request in accordance with applicable data protection laws.
					</p>
					<p>
						If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time. Please note however that this will not affect the lawfulness of the processing before its withdrawal.
					</p>
					<p>
						If you are resident in the European Economic Area and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details here: http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.html
					</p>
				 
					<h4>Account Information</h4>
					<p>
						If you would at any time like to review or change the information in your account or terminate your account, you can.
					</p>
					<p>
						Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.
					</p>
				</div>

				<div>
					<h3>11. Controls for do-not-track features?</h3>
					<p>
						Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. No uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Policy. 
					</p>
				</div>

				<div>
					<h3>12. Do we make updates to this policy?</h3>
					<p>
						In Short: Yes, we will update this policy as necessary to stay compliant with relevant laws.
					</p>
					<p>
						We may update this privacy policy from time to time. The updated version will be indicated by an updated “Revised” date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy policy, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.
					</p>
				</div>

				<div>
					<h3>13. How can you contact us about this policy?</h3>

					<p>
						If you have questions or comments about this policy, you may email us at {this.props.emailContact}.
					</p>
				</div>
			</Container>
		)
	}
}

export default withTranslation()(PrivacyPolicy);