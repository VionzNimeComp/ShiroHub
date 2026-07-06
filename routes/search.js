const express = require('express');
const router = express.Router();

module.exports = (api) => {
    router.get('/', async (req, res) => {
        try {
            const query = req.query.q;
            if (!query) return res.redirect('/');
            const results = await api.search(query);
            res.render('search', {
                data: results,
                active: 'search',
                query: query
            });
        } catch (error) {
            res.render('search', {
                data: [],
                active: 'search',
                query: req.query.q
            });
        }
    });
    return router;
};
