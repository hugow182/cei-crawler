const axios = require('axios').default;
const https = require('https');
const { CeiCrawlerError, CeiErrorTypes } = require('./CeiCrawlerError');

class AxiosWrapper {

    static setup(options) {
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });

        axios.interceptors.request.use(config => {
            config.headers = {
                'Authorization': `Bearer ${options.auth.token}`
            };
            config.params['cache-guid'] = options.auth['cache-guid'];
            config.httpsAgent = httpsAgent;
            return config;
        });
    }

    static async request(url, opts = {}) {
        const pathParams = opts.pathParams || {};
        const queryParams = opts.queryParams || {};
        try {
            const urlWithParams = Object.keys(pathParams)
                .reduce((p, v) => {
                    return p.replace(`:${v}`, pathParams[v]);
                }, url);

            const response = await axios.get(urlWithParams, {
                params: {
                    ...queryParams
                }
            });
            return response.data;
        } catch (e) {
            const msg = e.response.data == null || e.response.data.trim() == '' ? e.message : e.response.data;
            throw new CeiCrawlerError(CeiErrorTypes.BAD_REQUEST, msg, e.response.status);
        }
    }
}

module.exports = AxiosWrapper;