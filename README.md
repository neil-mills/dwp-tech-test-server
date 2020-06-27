# DWP Technical Test

## Server

### Approach

I have wrapped the REST API with GraphQL to create a single query `londonUsers` which returns users either living in London or within a 50 mile proximity to London.
The query resolver requests data from both the `/users` and `/city/London/users` REST API endpoints which i have then combined into a single response.

To filter the users who's current coordinates are inside the required proximity of London, I have used the `geolib` library to make the distance calculations. This is an alternative to using a payed service such as GoogleAPI. I have chosen to hard-code the latitude and longitude of central London for simplicity. This again could have been fetched from a service for more accuracy. The `geolib` Library returns results in miles so i have also chosen to hard-code the total metres in a mile.

With review of the data returned from the REST API endpoints, I identified that the identical users returned from the `/city/London/users` and '/users endpoints had different id's. For this reason I have filtered out duplicate users in the response using their email address.

I have chosen to use Typescript over Javascript.

For server-side error logging I have used the `winston` library.

### Tech Choices

To create the GraphQL API wrapper I have used Express for the HTTP server and Apollo Server to connect the GraphQL Schema. 
My reason for selecting this stack is I am bundling the server and client into a single application for deployment, and served the static client `index.html` file with Express.

### Launching the dev server

Running `npm run start` spins up the server on port 9000 in development mode. The graphQL API and playground is then available at at http://localhost:9000/api

### Hosted application

The application has been deployed to Heroku at http://