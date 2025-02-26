
# File Handling in GraphQL

Basic implementation of an express server that handles files upload and info retrieval using GraphQL.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV = production`

`PORT = 5000`


## Dependencies used

**Server:** express, @apollo/server, graphql, graphQL-upload, dotenv 


## Installation and Run

Clone the project

```bash
  git clone https://github.com/jillBhatt26/apollo-express-graphql-file-handler.git
```

Go to the project directory

```bash
  cd apollo-express-graphql-file-handler
```

Create .env and add the environment variables as mentioned above

```bash
  touch .env
```

Install dependencies

```bash
  yarn install --frozen-lockfile
```

Start the server

```bash
  node ./index.js
```

Use ApolloServer introspection tool in the browser

```bash
  http://localhost:{PORT}/graphql
```

