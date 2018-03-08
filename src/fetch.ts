import fetch from 'node-fetch';
import * as HttpsProxyAgent from 'https-proxy-agent';

export default (url: string, options) => {
    const instanceOptions = {
        ...options
    };

    if (!options.agent && process.env.HTTP_PROXY) {
        instanceOptions.agent = new HttpsProxyAgent(process.env.HTTP_PROXY);
    }

    return fetch(url, instanceOptions);
};