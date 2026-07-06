const express = require('express');
const router = express.Router();

module.exports = (api) => {
    router.get('/:animeSlug/:epsSlug', async (req, res) => {
        try {
            const { animeSlug, epsSlug } = req.params;
            const animeId = animeSlug.split('-')[0];
            const epsId = epsSlug.split('-')[0];
            
            const [streamUrl, detailData] = await Promise.all([
                api.stream(animeId, epsId),
                api.detail(animeId)
            ]);

            
            const currentEpisode = detailData.episodes.find(e => e.id == epsId);
            const episodeNumber = currentEpisode ? currentEpisode.title.replace('Episode ', '') : epsId;

            res.render('watch', {
                url: streamUrl,
                anime: detailData,
                currentEps: epsId,
                episodeNumber: episodeNumber,
                active: 'home'
            });
        } catch (error) {
            res.render('error', { error: error.message });
        }
    });
    return router;
};
