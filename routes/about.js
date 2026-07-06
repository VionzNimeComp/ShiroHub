const express = require('express');
const router = express.Router();

module.exports = () => {
    router.get('/', async (req, res) => {
        try {
            res.render('about', { active: 'about' });
        } catch (error) {
            res.render('error', { error: error.message });
        }
    });
    return router;
};
