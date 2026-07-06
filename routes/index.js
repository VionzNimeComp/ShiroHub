const homeRoute = require('./home');
const scheduleRoute = require('./schedule');
const searchRoute = require('./search');
const aboutRoute = require('./about');
const animeRoute = require('./anime');
const watchRoute = require('./watch');

module.exports = (app, api) => {
    app.use('/', homeRoute(api));
    app.use('/schedule', scheduleRoute(api));
    app.use('/search', searchRoute(api));
    app.use('/about', aboutRoute());
    app.use('/anime', animeRoute(api));
    app.use('/watch', watchRoute(api));
};
