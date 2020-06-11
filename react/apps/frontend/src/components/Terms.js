import React, { Component } from 'react';

import { withTranslation } from 'react-i18next'

import { Container } from 'react-bootstrap'


class Terms extends Component {
	render() {
		const { t } = this.props
		return (
			<Container>
				<h1>TERMS AND CONDITIONS</h1>

				<h2>Last Updated 07 June  2020</h2>

				<div>
					<h4>1. Agreement to Terms</h4>

					<ul>
						<li>
							<p>
								1.1  These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (you), and {this.props.domainName}, concerning your access to and use of the website ({this.props.domainName}) as well as any related applications (the Site).
							</p>
							<p>
								The Site provides the following services: Online search engine for book references (Services). You agree that by accessing the Site and/or Services, you have read, understood, and agree to be bound by all of these Terms and Conditions.
							</p>
							<p>
								If you do not agree with all of these Terms and Conditions, then you are prohibited from using the Site and Services and you must discontinue use immediately. We recommend that you print a copy of these Terms and Conditions for future reference.
							</p>
						</li>
						<li>
							<p>
								1.2  The supplemental terms and condition or documents that may be posted on the Site from time to time, are expressly incorporated by reference.
							</p>
						</li>
						<li>
							<p>
								1.3  We may make changes to these Terms and Conditions at any time. The updated version of these Terms and Conditions will be indicated by an updated “Revised” date and the updated version will be effective as soon as it is accessible. You are responsible for reviewing these Terms and Conditions to stay informed of updates. Your continued use of the Site represents that you have accepted such changes.
							</p>
						</li>
						<li>
							<p>
								1.4  We may update or change the Site from time to time to reflect changes to our products, our users' needs and/or our business priorities.
							</p>
						</li>
						<li>
							<p>
								1.5  Our site is directed to people residing in United Kingdom. The information provided on the Site is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.
							</p>
						</li>
						<li>
							<p>
								1.6  The Site is intended for users who are at least 18 years old.  If you are under the age of 18, you are not permitted to register for the Site or use the Services without parental permission.
							</p>
						</li>
					</ul>
				</div>

				<div>
					<h4>2. Acceptable Use</h4>

					<ul>
						<li>
							<p>
								2.1  You may not access or use the Site for any purpose other than that for which we make the site and our services available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
							</p>
						</li>
						<li>
							2.2  As a user of this Site, you agree not to:
							<ul>
								<li>
									Systematically retrieve data or other content from the Site to a compile database or directory without written permission from us
								</li>
								<li>
									Make any unauthorized use of the Site, including collecting usernames and/or email addresses of users to send unsolicited email or creating user accounts under false pretenses
								</li>
								<li>
									Use the Site to advertise or sell goods and services
								</li>
								<li>
									Circumvent, disable, or otherwise interfere with security-related features of the Site, including features that prevent or restrict the use or copying of any content or enforce limitations on the use
								</li>
								<li>
									Engage in unauthorized framing of or linking to the Site
								</li>
								<li>
									Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords
								</li>
								<li>
									Make improper use of our support services, or submit false reports of abuse or misconduct
								</li>
								<li>
									Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools
								</li>
								<li>
									Interfere with, disrupt, or create an undue burden on the Site or the networks and services connected to the Site
								</li>
								<li>
									Use any information obtained from the Site in order to harass, abuse, or harm another person
								</li>
								<li>
									Use the Site or our content as part of any effort to compete with us or to create a revenue-generating endeavor or commercial enterprise
								</li>
								<li>
									Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Site
								</li>
								<li>
									Attempt to access any portions of the Site that you are restricted from accessing
								</li>
								<li>
									Harass, annoy, intimidate, or threaten any of our employees, agents, or other users
								</li>
								<li>
									Delete the copyright or other proprietary rights notice from any of the content
								</li>
								<li>
									Copy or adapt the Site’s software, including but not limited to Flash, PHP, HTML, JavaScript, or other code
								</li>
								<li>
									Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material that interferes with any party’s uninterrupted use and enjoyment of the Site, or any material that acts as a passive or active information collection or transmission mechanism
								</li>
								<li>
									Use, launch, or engage in any automated use of the system, such as using scripts to send comments or messages, robots, scrapers, offline readers, or similar data gathering and extraction tools
								</li>
								<li>
									Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site
								</li>
								<li>
									Use the Site in a manner inconsistent with any applicable laws or regulations
								</li>
								<li>
									Advertise products or services not intended by us
								</li>
								<li>
									Falsely imply a relationship with us or another company with whom you do not have a relationship
								</li>
							</ul>
						</li>
					</ul>
				</div>


				<div>
					<h4>3. Information you provide to us</h4>

					<ul>
						<li>
							<p>
								3.1  You represent and warrant that: (a) all registration information you submit will be true, accurate, current, and complete and relate to you and not a third party; (b) you will maintain the accuracy of such information and promptly update such information as necessary; (c) you will keep your password confidential and will be responsible for all use of your password and account; (d) you have the legal capacity and you agree to comply with these Terms and Conditions; and (e) you are not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use the Site.
							</p>
							<p>
								If you know or suspect that anyone other than you knows your user information (such as an identification code or user name) and/or password you must promptly notify us at {this.props.emailContact}.
							</p>
						</li>
						<li>
							<p>
								3.2  If you provide any information that is untrue, inaccurate, not current or incomplete, we may suspend or terminate your account. We may remove or change a user name you select if we determine that such user name is inappropriate.
							</p>
						</li>
						<li>
							<p>
								3.3  As part of the functionality of the Site, you may link your account with online accounts you may have with third party service providers (each such account, a Third Party Account) by either: (a) providing your Third Party Account login information through the Site; or (b) allowing us to access your Third Party Account, as is permitted under the applicable terms and conditions that govern your use of each Third Party Account.
							</p>
							<p>
								You represent that you are entitled to disclose your Third Party Account login information to us and/or grant us access to your Third Party Account without breach by you of any of the terms and conditions that govern your use of the applicable Third Party Account and without obligating us to pay any fees or making us subject to any usage limitations imposed by such third party service providers.
							</p>
						</li>
						<li>
							<p>
								3.4  By granting us access to any Third Party Accounts, you understand that (a) we may access, make available and store (if applicable) any content that you have provided to and stored in your Third Party Account (the “Social Network Content”) so that it is available on and through the Site via your account, including without limitation any friend lists;  and (b) we may submit and receive additional information to your Third Party Account to the extent you are notified when you link your account with the Third Party Account.
							</p>
							<p>
								Depending on the Third Party Accounts you choose and subject to the privacy settings that you have set in such Third Party Accounts, personally identifiable information that you post to your Third Party Accounts may be available on and through your account on the Site. Please note that if a Third Party Account or associated service becomes unavailable or our access to such Third Party Account is terminated by the third party service provider, then Social Network Content may no longer be available on and through the Site.
							</p>
							<p>
								You will have the ability to disable the connection between your account on the Site and your Third Party Accounts at any time. Please note that your relationship with the third party service providers associated with your third party accounts is governed solely by your agreement(s) with such third party service providers.  We make no effort to review any Social Network Content for any purpose, including but not limited to, for accuracy, legality or non-infringement, and we are not responsible for any Social Network Content.
							</p>
						</li>
					</ul>
				</div>


				<div>
					<h4>4. Content you provide to us</h4>

					<ul>
						<li>
							<p>
								4.1  There may be opportunities for you to post content to the Site or send feedback to us (User Content). You understand and agree that your User Content may be viewed by other users on the Site, and that they may be able to see who has posted that User Content.
							</p>
						</li>
						<li>
							<p>
								4.2  You further agree that we can use your User Content for any other purposes whatsoever in perpetuity without payment to you, and combine your User Content with other content for use within the Site and otherwise. We do not have to attribute your User Content to you.  
							</p>
						</li>
						<li>
							<p>
								4.3  In posting User Content, including reviews or making contact with other users of the Site you shall comply with our Acceptable Use Policy.
							</p>
						</li>
						<li>
							<p>
								4.4  You warrant that any User Content does comply with our Acceptable Use Policy, and you will be liable to us and indemnify us for any breach of that warranty. This means you will be responsible for any loss or damage we suffer as a result of your breach of this warranty.
							</p>
						</li>
						<li>
							<p>
								4.5  We have the right to remove any User Content you put on the Site if, in our opinion, such User Content does not comply with the Acceptable Use Policy.
							</p>
						</li>
						<li>
							<p>
								4.6  We are not responsible and accept no liability for any User Content including any such content that contains incorrect information or is defamatory or loss of User Content. We accept no obligation to screen, edit or monitor any User Content but we reserve the right to remove, screen and/or edit any User Content without notice and at any time. User Content has not been verified or approved by us and the views expressed by other users on the Site do not represent our views or values
							</p>
						</li>
						<li>
							<p>
								4.7  If you wish to complain about User Content uploaded by other users please contact us at {this.props.emailContact}.
							</p>
						</li>
					</ul>
				</div>

				<div>
					<h4>5. Our content</h4>

					<ul>
						<li>
							<p>
								5.1  Unless otherwise indicated, the Site and Services including source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (Our Content) are owned or licensed to us, and are protected by copyright and trade mark laws.
							</p>
						</li>
						<li>
							<p>
								5.2  Except as expressly provided in these Terms and Conditions, no part of the Site, Services or Our Content may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
							</p>
						</li>
						<li>
							<p>
								5.3  Provided that you are eligible to use the Site, you are granted a limited licence to access and use the Site and Our Content and to download or print a copy of any portion of the Content to which you have properly gained access solely for your personal, non-commercial use.
							</p>
						</li>
						<li>
							<p>
								5.4  You shall not (a) try to gain unauthorised access to the Site or any networks, servers or computer systems connected to the Site; and/or (b) make for any purpose including error correction, any modifications, adaptions, additions or enhancements to the Site or Our Content, including the modification of the paper or digital copies you may have downloaded.
							</p>
						</li>
						<li>
							<p>
								5.5  We shall (a) prepare the Site and Our Content with reasonable skill and care; and (b) use industry standard virus detection software to try to block the uploading of content to the Site that contains viruses.
							</p>
						</li>
						<li>
							<p>
								5.6  The content on the Site is provided for general information only. It is not intended to amount to advice on which you should rely. You must obtain professional or specialist advice before taking, or refraining from taking, any action on the basis of the content on the Site.
							</p>
						</li>
						<li>
							<p>
								5.7  Although we make reasonable efforts to update the information on our site, we make no representations, warranties or guarantees, whether express or implied, that Our Content on the Site is accurate, complete or up to date.
							</p>
						</li>
					</ul>
				</div>

				<div>
					<h4>6. Site Management</h4>

					<ul>
						<li>
							<p>
								6.1  We reserve the right at our sole discretion, to (1) monitor the Site for breaches of these Terms and Conditions; (2) take appropriate legal action against anyone in breach of applicable laws or these Terms and Conditions; (3) refuse, restrict access to or availability of, or disable (to the extent technologically feasible) any of your Contributions; (4) remove from the Site or otherwise disable all files and content that are excessive in size or are in any way a burden to our systems; and (5) otherwise manage the Site in a manner designed to protect our rights and property and to facilitate the proper functioning of the Site and Services.
							</p>
						</li>
						<li>
							<p>
								6.2  We do not guarantee that the Site will be secure or free from bugs or viruses.
							</p>
						</li>
						<li>
							<p>
								6.3  You are responsible for configuring your information technology, computer programs and platform to access the Site and you should use your own virus protection software.
							</p>
						</li>
					</ul>
				</div>

				<div>
					<h4>7. Modifications to and availability of the Site</h4>

					<ul>
						<li>
							<p>
								7.1  We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. We also reserve the right to modify or discontinue all or part of the Services without notice at any time.
							</p>
						</li>
						<li>
							<p>
								7.2  We cannot guarantee the Site and Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Site, resulting in interruptions, delays, or errors. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Site or Services during any downtime or discontinuance of the Site or Services.We are not obliged to maintain and support the Site or Services or to supply any corrections, updates, or releases.
							</p>
						</li>
						<li>
							<p>
								7.3  There may be information on the Site that contains typographical errors, inaccuracies, or omissions that may relate to the Services, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information at any time, without prior notice.  
							</p>
						</li>
					</ul>
				</div>

				<div>
					<h4>8. Disclaimer/Limitation of Liability</h4>

					<ul>
						<li>
							<p>
								8.1  The Site and Services are provided on an as-is and as-available basis. You agree that your use of the Site and/or Services will be at your sole risk except as expressly set out in these Terms and Conditions. All warranties, terms, conditions and undertakings, express or implied (including by statute, custom or usage, a course of dealing, or common law) in connection with the Site and Services and your use thereof including, without limitation, the implied warranties of satisfactory quality, fitness for a particular purpose and non-infringement are excluded to the fullest extent permitted by applicable law.
							</p>
							<p>
								We make no warranties or representations about the accuracy or completeness of the Site’s content and are not liable for any (1) errors or omissions in content: (2) any unauthorized access to or use of our servers and/or any and all personal information and/or financial information stored on our server; (3) any interruption or cessation of transmission to or from the site or services; and/or (4) any bugs, viruses, trojan horses, or the like which may be transmitted to or through the site by any third party. We will not be responsible for any delay or failure to comply with our obligations under these Terms and Conditions if such delay or failure is caused by an event beyond our reasonable control.
							</p>
						</li>
						<li>
							<p>
								8.2  The Site and does not contain and cannot offer professional advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.
							</p>
						</li>
						<li>
							<p>
								8.3  The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences.
							</p>
							<p>
								The views and opinions contained in the testimonials belong solely to the individual user and do not reflect our views and opinions. We are not affiliated with users who provide testimonials, and users are not paid or otherwise compensated for their testimonials.
							</p>
						</li>
						<li>
							<p>
								8.4  The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.
							</p>
							<p>
								We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site or any website or feature linked in any banner or other advertising. we will not be a party to or in any way be responsible for monitoring any transaction between you and third-party providers of products or services.
							</p>
						</li>
						<li>
							<p>
								8.5  Our responsibility for loss or damage suffered by you:

								In no event shall we be liable for any claims, penalties, loss, damage or expenses, howsoever arising, out of or in connection with your use of the Website, including, without limitation, direct or indirect loss, consequential loss or damage, loss of profit or goodwill, loss of data, loss arising from use or inability to use the Website, loss arising from any errors or omissions in the Website as a result of breach of contract, negligence, delict.
							</p>
							<p>
								Whether you are a consumer or a business user:
								<ul>
									<li>
										Please note that we only provide our Site for domestic and private use. You agree not to use our Site for any commercial or business purposes, and we have no liability to you for any loss of profit, loss of business, business interruption, or loss of business opportunity.
									</li>
									<li>
										We do not exclude or limit in any way our liability to you where it would be unlawful to do so.
									</li>
								</ul>
							</p>
						</li>
					</ul>
				</div>

				<div>
					<h4>9. Term and Termination</h4>

					<ul>
						<li>
							<p>
								9.1  These Terms and Conditions shall remain in full force and effect while you use the Site or Services or are otherwise a user of the Site, as applicable. You may terminate your use or participation at any time, for any reason, by following the instructions for terminating user accounts in your account settings, if available, or by contacting us at {this.props.emailContact}.
							</p>
						</li>
						<li>
							<p>
								9.2  Without limiting any other provision of these Terms and Conditions, we reserve the right to, in our sole discretion and without notice or liability, deny access to and use of the Site and the Services (including blocking certain IP addresses), to any person for any reason including without limitation for breach of any representation, warranty or covenant contained in these Terms and Conditions or of any applicable law or regulation.
							</p>
							<p>
								If we determine, in our sole discretion, that your use of the Site/Services is in breach of these Terms and Conditions or of any applicable law or regulation, we may terminate your use or participation in the Site and the Services or delete your profile and any content or information that you posted at any time, without warning, in our sole discretion.
							</p>
						</li>
						<li>
							<p>
								9.3  If we terminate or suspend your account for any reason set out in this Section 9, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress. 
							</p>
						</li>
					</ul>
				</div>

				<div>
					<h4>10. General</h4>

					<ul>
						<li>
							<p>    
								10.1  Visiting the Site, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Site, satisfy any legal requirement that such communication be in writing.
							</p>
							<p>
								You hereby agree to the use of electronic signatures, contracts, orders and other records and to electronic delivery of notices, policies and records of transactions initiated or completed by us or via the Site. You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by other than electronic means.
							</p>
						</li>
						<li>
							<p>
								10.2  These Terms and Conditions and any policies or operating rules posted by us on the Site or in respect to the Services constitute the entire agreement and understanding between you and us.
							</p>
						</li>
						<li>
							<p>
								10.3  Our failure to exercise or enforce any right or provision of these Terms and Conditions shall not operate as a waiver of such right or provision.
							</p>
						</li>
						<li>
							<p>
								10.4  We may assign any or all of our rights and obligations to others at any time.
							</p>
						</li>
						<li>
							<p>
								10.5  We shall not be responsible or liable for any loss, damage, delay or failure to act caused by any cause beyond our reasonable control.
							</p>
						</li>
						<li>
							<p>
								10.6  If any provision or part of a provision of these Terms and Conditions is unlawful, void or unenforceable, that provision or part of the provision is deemed severable from these Terms and Conditions and does not affect the validity and enforceability of any remaining provisions.
							</p>
						</li>
						<li>
							<p>
								10.7  There is no joint venture, partnership, employment or agency relationship created between you and us as a result of these Terms and Conditions or use of the Site or Services.
							</p>
						</li>
						<li>
							<p>
								10.8  For consumers only  - Please note that these Terms and Conditions, their subject matter and their formation, are governed by English law. You and we both agree that the courts of England and Wales will have exclusive jurisdiction expect that if you are a resident of Northern Ireland you may also bring proceedings in Northern Ireland, and if you are resident of Scotland, you may also bring proceedings in Scotland. If you have any complaint or wish to raise a dispute under these Terms and Conditions or otherwise in relation to the Site please follow this link http://ec.europa.eu/odr
							</p>
						</li>
						<li>
							<p>
								10.9  A person who is not a party to these Terms and Conditions shall have no right under the Contracts (Rights of Third Parties) Act 1999 to enforce any term of these Terms and Conditions.
							</p>
						</li>
						<li>
							<p>
								10.10  In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us by email at {this.props.emailContact}.
							</p>
						</li>
					</ul>
				</div>
			</Container>
		)
	}
}

export default withTranslation()(Terms);