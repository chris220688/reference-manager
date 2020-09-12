var localDeployment = false

var adminDomain = 'admin:8000'

if (localDeployment) {
	adminDomain = 'http://localhost:8000'
}

export const constants = {
	adminDomain: adminDomain,
}
