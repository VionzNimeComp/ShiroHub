const express = require('express');
const router = express.Router();

module.exports = (api) => {
    router.get('/', async (req, res) => {
        try {
            const homeData = await api.fetchHomeData();
            res.render('index', {
                data: homeData,
                active: 'home',
                query: null
            });
        } catch (error) {
            res.render('error', { error: error.message });
        }
    });
    return router;
};
