require('dotenv').config();
const express = require('express');
const path = require('path');
const ShiroHubAPI = require('./lib/ServerData');
const setupRoutes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;
const api = new ShiroHubAPI();

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

setupRoutes(app, api);

app.use((req, res) => {
    res.status(404).render('404', { active: '' });
});

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).render('error', { error: 'Terjadi kesalahan pada server.' });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`🦊 ShiroHub running at http://localhost:${port}`);
    });
}

module.exports = app;
