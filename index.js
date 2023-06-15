require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { ValidationError } = require('express-validation');
const db = require("./config/database.config");
const authController = require('./controllers/auth.controller');
const artController = require('./controllers/art.controller');
const sessionController = require('./controllers/session.controller');
var auth = require('./middlewares/publicauth.middleware');
var Response = require('./middlewares/response.middleware');
var verifyRequest = require('./middlewares/requestverify.middleware');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger(function (tokens, req, res) {
    return [
        Date(),
        Headers['Authorization'] ? '[WA]' : '[WOA]',
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}));

app.use(Response);
app.use(verifyRequest);

app.get('/ping', (_, res) => {
    console.log('Someone checked our hartbeat, and what? Our heart is beating in the perfect order.');
    res.Success("Pong! Thanks for checking our status. Our heart is beating perfectly.");
});

app.use('/auth', authController);
app.use('/art', auth, artController);
app.use('/session', auth, sessionController)
/*
// Validation Error middleware.
*/
app.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message
        });
    }
    return res.Exception("Wrong request", err);
});

var PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Bonjour ingénieur... Le serveur s'exécute sur le port ${PORT}`);
    db.connect();
});