const createError = require('http-errors');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const graphql = require('graphql');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// PostgreSQL
const { Client } = require('pg');
const joinMonster = require('join-monster');

const client = new Client({
  host: "localhost",
  user: "toggl",
  password: "{YOUR_POSTGRES_PASSWORD}",
  database: "{YOUR_POSTGRES_DATABASE}"
})
client.connect();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testRouter  = require('./routes/testAPI');


const app = express();

// GraphQL Schema
const graphqlSchema = require('./schema/schema')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/testApi', testRouter);

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  graphiql: true,
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
