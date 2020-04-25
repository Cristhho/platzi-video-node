const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { config } = require('./config/index');
const moviesApi = require('./routes/movies');
const {
  logErrors,
  wrapErrors,
  errorHandler,
} = require('./utils/middleware/errorHandlers');
const notFountHandler = require("./utils/middleware/notFoundHandler");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

moviesApi(app);
app.use(notFountHandler);

app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Listening http://localhost:${config.port}`);
});
