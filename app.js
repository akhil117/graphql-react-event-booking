const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const graphqlSchema = require('./graphql/schemas/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const mongoose = require('mongoose');
const isAuth = require('./middlewares/is-auth');

const app = express();

const mongoDB = 'mongodb://127.0.0.1/Graphql';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected  to mongodb'))
  .catch(err => console.error('not able to connect '));

app.use(bodyParser.json());
app.use(isAuth);


// manual population

app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true
}));

app.listen(3200);