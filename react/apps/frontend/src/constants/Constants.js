var localDeployment = true

var emailContact = 'findbooksources@gmail.com'
var serversLocation = 'United Kingdom'

// https://findsources.co.uk -> production
// http://localhost:3000 -> locally
var domainName = window.location.protocol + '//' + window.location.host

var consumerDomain = domainName
var producerDomain = domainName
var producerLoginRedirectEndpoint = producerDomain + '/api/producer/login-redirect'
var producerLoginEndpoint = producerDomain + '/api/producer/login/'
var producerLogoutEndpoint = producerDomain + '/api/producer/logout/'
var producerLoginCheckEndpoint = producerDomain + '/api/producer/user-session-status/'
var producerInsertEndpoint = producerDomain + '/api/producer/insert-reference/'
var producerEditReferenceEndpoint = producerDomain + '/api/producer/edit-reference/'
var producerDeleteEndpoint = producerDomain + '/api/producer/delete-reference/'
var producerReferencesEndpoint = producerDomain + '/api/producer/get-references/'
var producerCaregoriesEndpoint = producerDomain + '/api/producer/get-categories/'
var producerBookmarksEndpoint = producerDomain + '/api/producer/bookmark/'
var producerJoinEndpoint = producerDomain + '/api/producer/join/'
var producerAccountDetailsEndpoint = producerDomain + '/api/producer/get-account/'
var producerDeleteAccountEndpoint = producerDomain + '/api/producer/delete-account/'
var producerRateReferenceEndpoint = producerDomain + '/api/producer/rate-reference/'
var consumerSearchEndpoint = consumerDomain + '/api/consumer/search/'

if (localDeployment) {
	consumerDomain = 'http://localhost:8001'
	producerDomain = 'http://localhost:8000'
	producerLoginRedirectEndpoint = producerDomain + '/login-redirect'
	producerLoginEndpoint = producerDomain + '/login/'
	producerLogoutEndpoint = producerDomain + '/logout/'
	producerLoginCheckEndpoint = producerDomain + '/user-session-status/'
	producerInsertEndpoint = producerDomain + '/insert-reference/'
	producerEditReferenceEndpoint = producerDomain + '/edit-reference/'
	producerDeleteEndpoint = producerDomain + '/delete-reference/'
	producerReferencesEndpoint = producerDomain + '/get-references/'
	producerCaregoriesEndpoint = producerDomain + '/get-categories/'
	producerBookmarksEndpoint = producerDomain + '/bookmark/'
	producerJoinEndpoint = producerDomain + '/join/'
	producerAccountDetailsEndpoint = producerDomain + '/get-account/'
	producerDeleteAccountEndpoint = producerDomain + '/delete-account/'
	producerRateReferenceEndpoint = producerDomain + '/rate-reference/'
	consumerSearchEndpoint = consumerDomain + '/search/'
}

export const constants = {
	domainName: domainName,
	producerLoginRedirectEndpoint: producerLoginRedirectEndpoint,
	producerLoginEndpoint: producerLoginEndpoint,
	producerLogoutEndpoint: producerLogoutEndpoint,
	producerLoginCheckEndpoint: producerLoginCheckEndpoint,
	producerInsertEndpoint: producerInsertEndpoint,
	producerEditReferenceEndpoint: producerEditReferenceEndpoint,
	producerDeleteEndpoint: producerDeleteEndpoint,
	producerReferencesEndpoint: producerReferencesEndpoint,
	producerCaregoriesEndpoint: producerCaregoriesEndpoint,
	producerBookmarksEndpoint: producerBookmarksEndpoint,
	producerJoinEndpoint: producerJoinEndpoint,
	producerAccountDetailsEndpoint: producerAccountDetailsEndpoint,
	producerDeleteAccountEndpoint: producerDeleteAccountEndpoint,
	producerRateReferenceEndpoint: producerRateReferenceEndpoint,
	consumerSearchEndpoint: consumerSearchEndpoint,
	emailContact: emailContact,
	serversLocation: serversLocation,
}
