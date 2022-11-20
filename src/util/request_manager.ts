import {IResourceType} from './ajax';
import config from '../util/config';

import type {RequestParameters} from './ajax';

type ResourceTypeEnum = keyof IResourceType;
export type RequestTransformFunction = (url: string, resourceType?: ResourceTypeEnum) => RequestParameters;

type UrlObject = {
    protocol: string;
    authority: string;
    path: string;
    params: Array<string>;
};

export class RequestManager {
    _transformRequestFn: RequestTransformFunction;
    _customAccessToken: string;

    constructor(transformRequestFn?: RequestTransformFunction, accessToken?: string) {
        this._transformRequestFn = transformRequestFn;
        this._customAccessToken = accessToken;
    }

    transformRequest(url: string, type: ResourceTypeEnum) {
        if (this._transformRequestFn) {
            return this._transformRequestFn(url, type) || {url};
        }

        return {url};
    }

    normalizeSpriteURL(url: string, format: string, extension: string): string {
        const urlObject = this.parseUrl(url);
        if (urlObject.protocol == 'http' || urlObject.protocol == 'http' || urlObject.protocol == 'file') {
            urlObject.path += `${format}${extension}`;
            return this.formatUrl(urlObject);
        } else if (urlObject.protocol == 'mapabc' || urlObject.protocol == 'mapbox') {
            return this.formatProperStyleUrl(urlObject, format, extension);
        }
    }

    normalizeGlyphsURL(url: string): string {
        if (!isMapboxURL(url)) {
            return url;
        }
        const urlObject = this.parseUrl(url);
        urlObject.path = `/fonts/v1${urlObject.path}`;
        return this.formatProperGlyphsUrl(urlObject, this._customAccessToken || config.ACCESS_TOKEN);
    }

    setTransformRequest(transformRequest: RequestTransformFunction) {
        this._transformRequestFn = transformRequest;
    }

    setAccessToken(accessToken: string) {
        this._customAccessToken = accessToken;
    }

    formatProperStyleUrl(obj: UrlObject, format: string, extension: string): string {
        if (obj.protocol == 'mapabc') {
            let styleName = obj.path.replace('/', '');
            let styleFileType = extension.replace('.', '');
            const params = obj.params.length ? `${obj.params.join('&')}` : '';
            const accessToken = this._customAccessToken || config.ACCESS_TOKEN;
            return `${config.API_URL}/webglapi/sprite?n=${styleName}${format}&e=${styleFileType}&ak=${accessToken}&${params}`;
        } else {
            const params = obj.params.length ? `?${obj.params.join('&')}` : '';
            return `${obj.protocol}://${obj.authority}${obj.path}${params}`;
        }
    }

    formatProperGlyphsUrl(obj: UrlObject, accessToken: string): string {
        const params = obj.params.length ? `${obj.params.join('&')}` : '';
        //Request URL: http://121.36.99.212:35001/webglapi/fonts?n=sourcehansanscn-normal&r=0-255&ak=ec85d3648154874552835438ac6a02b2
        return `${config.API_URL}/webglapi/fonts?n={fontstack}&r={range}&ak=${accessToken}&${params}`;
    }

    urlRe = /^(\w+):\/\/([^/?]*)(\/[^?]+)?\??(.+)?/;

    parseUrl(url: string): UrlObject {
        const parts = url.match(this.urlRe);
        if (!parts) {
            throw new Error(`Unable to parse URL "${url}"`);
        }
        return {
            protocol: parts[1],
            authority: parts[2],
            path: parts[3] || '/',
            params: parts[4] ? parts[4].split('&') : []
        };
    }

    formatUrl(obj: UrlObject): string {
        const params = obj.params.length ? `?${obj.params.join('&')}` : '';
        return `${obj.protocol}://${obj.authority}${obj.path}${params}`;
    }
}

function isMapboxURL(url: string) {
    return url.indexOf('mapbox:') === 0 || url.indexOf('mapabc:') === 0;
}

function isHttpURL(url: string) {
    return url.indexOf('http:') === 0 || url.indexOf('https:') === 0;
}

function isMapboxHTTPURL(url: string): boolean {
    return config.API_URL_REGEX.test(url);
}

function hasCacheDefeatingSku(url: string) {
    return url.indexOf('sku=') > 0 && isMapboxHTTPURL(url);
}