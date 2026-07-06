const axios = require('axios');
const https = require('https');

class ShiroHubAPI {
    constructor() {
        this.inst = axios.create({
            baseURL: 'https://air.vunime.my.id/mobinime',
            timeout: 15000,
            httpsAgent: new https.Agent({ keepAlive: true }),
            headers: {
                'accept-encoding': 'gzip',
                'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'x-api-key': 'ThWmZq4t7w!z%C*F-JaNdRgUkXn2r5u8'
            }
        });
    }

    normalizeAnimeData(item) {
        const cleanTitle = (item.title || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        return {
            id: item.id,
            slug: `${item.id}-${cleanTitle}`,
            title: item.title || 'Tanpa Judul',
            img: item.image_cover || item.imageCover || item.image_video || '',
            eps: item.episode || item.total_episode || '?',
            rating: item.rating || '-',
            year: item.tahun || '',
            status: item.status_tayang === '1' ? 'Ongoing' : 'Completed'
        };
    }

    async fetchHomeData() {
        try {
            const { data } = await this.inst.get('/pages/homepage');
            const result = {
                recommend: (data.recommend || []).map(this.normalizeAnimeData),
                ongoing: (data.ongoing || []).map(this.normalizeAnimeData),
                schedule: []
            };
            if (data.schedule) {
                const dayName = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
                Object.keys(data.schedule).forEach(day => {
                    result.schedule.push({
                        day: dayName[parseInt(day) - 1] || 'Lainnya',
                        list: data.schedule[day].map(this.normalizeAnimeData)
                    });
                });
            }
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async search(query, { page = '0', count = '25' } = {}) {
        try {
            const { data } = await this.inst.post('/anime/search', {
                perpage: count.toString(),
                startpage: page.toString(),
                q: query
            });
            return (data || []).map(this.normalizeAnimeData);
        } catch (error) {
            return [];
        }
    }

    async detail(id) {
        try {
            const { data } = await this.inst.post('/anime/detail', { id: id.toString() });
            const cleanTitle = (data.title || '')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            return {
                id: data.id,
                slug: `${data.id}-${cleanTitle}`,
                title: data.title || 'Tanpa Judul',
                img: data.image_cover || data.image_video || '',
                desc: data.content || 'Deskripsi tidak tersedia.',
                rating: data.rating || '-',
                year: data.tahun || '-',
                status: data.status_tayang === '1' ? 'Ongoing' : 'Completed',
                genres: data.categories || [],
                episodes: (data.episodes || []).map(e => ({
                    id: e.id,
                    slug: `${e.id}-episode-${e.episode}`,
                    title: `Episode ${e.episode}`
                }))
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async stream(id, epsid, { quality = 'HD' } = {}) {
        try {
            const { data: srv } = await this.inst.post('/anime/get-server-list', {
                id: epsid.toString(),
                animeId: id.toString(),
                jenisAnime: '1',
                userId: ''
            });
            const { data } = await this.inst.post('/anime/get-url-video', {
                url: srv.serverurl,
                quality: quality,
                position: '0'
            });
            if (!data?.url) throw new Error('Stream URL tidak tersedia');
            return data.url;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = ShiroHubAPI;
