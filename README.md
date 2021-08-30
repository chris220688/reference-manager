![Snapshots CI](https://github.com/chris220688/reference-manager/workflows/Snapshots%20CI/badge.svg?branch=master)
![Consumer CI](https://github.com/chris220688/reference-manager/workflows/Consumer%20CI/badge.svg?branch=master)
![Producer CI](https://github.com/chris220688/reference-manager/workflows/Producer%20CI/badge.svg?branch=master)
![Frontend CI](https://github.com/chris220688/reference-manager/workflows/Frontend%20CI/badge.svg?branch=master)
![Admin CI](https://github.com/chris220688/reference-manager/workflows/Admin%20CI/badge.svg?branch=master)
![Admin Frontend CI](https://github.com/chris220688/reference-manager/workflows/Admin%20Frontend%20CI/badge.svg?branch=master)

# Description

This project is a **reference management system** powered by elasticsearch.

It is a set of microservices that allow references to be inserted into the system and then be made searchable with elastic search.

It was used to power [findsources.co.uk](https://www.findsources.co.uk), which was a search engine for books, based on content references.  

Users were able to register as authors and create their own book references. The search results were based on such references rather than the actual content of the books.

**After almost 1.5 years, I decided to take the website down, due to lack of time to generate enough content to attract users and also the high maintainance fees in Digital Ocean's Kubernetes cluster.**

# Architecture

The system is a combination of [ReactJs](https://reactjs.org/) (frontend) and [FastApi](https://fastapi.tiangolo.com/) (backend) microservices.

The search is performed by an [Elastic Search](https://www.elastic.co/) cluster and the results are rendered using [ReactiveSearch](https://opensource.appbase.io/reactivesearch/).

The database of choice is [MongoDB](https://www.mongodb.com/) and the synchronization between the database and Elastic Search indexes is achieved using [Monstache](https://rwynn.github.io/monstache-site/).

Errors are reported using [Sentry](https://sentry.io/welcome/) and Continuous Integration is managed by [Github Actions](https://github.com/features/actions).


# Scalability

The website has been designed in a way that it could scale to support a potentially higher number of users.

The services are built with separation of concerns (SoC) in mind and run in a kubernetes cluster, with the ability to scale horizontally. It goes without saying that Elastic Search can do the same.

MongoDB performance should not be a real concern since the search queries are performed on the Elastic Search cluster and not directly in MongoDB. However, if the schema grows more complex in the future, MongoDb could be easily unplugged without effort and replaced by a more traditional SQL one (like PostgreSQL), as long as it respects the interfaces that are in place.


# Security

Security is always one of the main concerns. The website is designed in a way that it follows (or at least it attempts to follow) some of the best practices when it comes to authentication.

However, since one can never guarantee that this will always stand true, the amount of personal information that is stored in the system has been kept to a minimum, so that even if the system is compromised, important data will not fall into the wrong hands.

That does make it a bit harder to create a unique personalized environment for every user, but it is a small price to pay for keeping our user's information secure.

Again, the philosophy is "If you can't keep something safe, don't keep it at all".

That being said:
1. SSL is enforced, using **Let's Encrypt** certificates.
2. Authentication is performed using the **OpenId Connect protocol**, exclusively via **Azure** and **Google**.
3. HTTPS secure cookies are used for short life sessions.
4. Personal information is kept to a minimum and when necessary, stored encrypted in the database.


# Hosting and CI/CD

The microservices are running inside a Digital Ocean Kubernetes cluster, behind a load balancer.

Automatic deployments are achieved using workflows with [Github Actions](https://github.com/features/actions) and [Docker](https://www.docker.com/) images.

Daily MongoDB snapshots are taken using DO's service.


# Technologies

|Front End                                                        |BackEnd                                              |Other                                                           |
|:---------------------------------------------------------------:|:---------------------------------------------------:|:--------------------------------------------------------------:|
|[ReactJs](https://reactjs.org/)                                  |[FastApi](https://fastapi.tiangolo.com/)             |[Kubernetes](https://kubernetes.io/)                            |
|[ReactiveSearch](https://opensource.appbase.io/reactivesearch/)  |[MongoDB](https://www.mongodb.com/)                  |[Digital Ocean](https://www.digitalocean.com/)                  |
|Azure/Google OpenIdConnect                                       |[ElasticSearch](https://www.elastic.co/)             |[Sentry](https://sentry.io/welcome/)                            |
|                                                                 |[Monstache](https://rwynn.github.io/monstache-site/) |[Github Actions](https://github.com/features/actions)           |

# Acknowledgements

Special thanks to the creators of [FastApi](https://fastapi.tiangolo.com/), [ReactiveSearch](https://opensource.appbase.io/reactivesearch/) and [Monstache](https://rwynn.github.io/monstache-site/).

Keep up the great work!
# Authors
Christos Liontos

