const express = require('express');
const router = express.Router();

module.exports = (api) => {
    router.get('/:slug', async (req, res) => {
        try {
            const id = req.params.slug.split('-')[0];
            const detailData = await api.detail(id);
            res.render('detail', { anime: detailData, active: 'home' });
        } catch (error) {
            res.render('error', { error: error.message });
        }
    });
    return router;
};
