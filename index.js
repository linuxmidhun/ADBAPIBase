require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const db = require("./config/database.config");
const auth = require('./controllers/auth.controller');
const art = require('./controllers/art.controller');
const { ValidationError } = require('express-validation');
const reqverify = require('./middlewares/requestverify.middleware');

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

//express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


app.use(passport.initialize());
app.use(passport.session());

app.get('/ping', reqverify, (_, res) => {
    console.log('Someone checked our hartbeat, and what? Our heart is beating in the perfect order.');
    res.status(200).json({
        status: 200,
        message: "Pong! Thanks for checking our status. Our heart is beating perfectly."
    });
});

app.use('/auth', auth);
app.use('/art', art);
app.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message
        });
    }
    return res.status(500).json({
        status: 500,
        message: "Wrong request",
        data: err
    });
});

var PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Bonjour ingénieur... Le serveur s'exécute sur le port ${PORT}`);
    db.connect();
});