import type {RequestParameters} from './ajax';
import {config} from './config';

/**
 * A type of MapLibre resource.
 */
export const enum ResourceType {
    Glyphs = 'Glyphs',
    Image = 'Image',
    Source = 'Source',
    SpriteImage = 'SpriteImage',
    SpriteJSON = 'SpriteJSON',
    Style = 'Style',
    Tile = 'Tile',
    Unknown = 'Unknown',
}

type UrlObject = {
    protocol: string;
    authority: string;
    path: string;
    params: Array<string>;
};

/**
 * This function is used to tranform a request.
 * It is used just before executing the relevant request.
 */
export type RequestTransformFunction = (url: string, resourceType?: ResourceType) => RequestParameters | undefined;
export type RequestTransformFunctionCustom = (url: string, resourceType?: ResourceType, accessToken?: string | null | void) => RequestParameters;

export class RequestManager {
    _transformRequestFn: RequestTransformFunction;
    transformRequestFnCustom: RequestTransformFunctionCustom;
    _customAccessToken: string;

    constructor(transformRequestFn?: RequestTransformFunction, accessToken?: string) {
        this._transformRequestFn = transformRequestFn;
        this._customAccessToken = accessToken || config.ACCESS_TOKEN || config.accessToken;
        this.transformRequestFnCustom = mspTransformRequestFunc;
       // console.log('mspTransformRequestFunc', mspTransformRequestFunc);
       // console.log('transformRequestFn', transformRequestFn);
       // console.log('accessToken', accessToken);
    }

    transformRequest(url: string, type: ResourceType) {
        if (this.transformRequestFnCustom) {
            url = this.transformRequestFnCustom(url, type, this._customAccessToken)['url'];
        }
        if (this._transformRequestFn) {
            return this._transformRequestFn(url, type) || {url};
        }
        return {url};
    }

    normalizeSpriteURL(url: string, format: string, extension: string): string {
        const urlObject = parseUrl(url);
        urlObject.path += `${format}${extension}`;
        return formatUrl(urlObject);
    }

    normalizeGlyphsURL(url: string): string {
        return url;
    }

    setTransformRequest(transformRequest: RequestTransformFunction) {
        this._transformRequestFn = transformRequest;
    }

    setTransformRequestMapAbc(transformRequest: RequestTransformFunction) {
        this.transformRequestFnCustom = transformRequest;
    }
}

const urlRe = /^(\w+):\/\/([^/?]*)(\/[^?]+)?\??(.+)?/;

function parseUrl(url: string): UrlObject {
    const parts = url.match(urlRe);
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

function formatUrl(obj: UrlObject): string {
    const params = obj.params.length ? `?${obj.params.join('&')}` : '';
    return `${obj.protocol}://${obj.authority}${obj.path}${params}`;
}

function makeAPIURL(urlObj: UrlObject, accessToken?: string | null | void): string {
    const apiUrl = parseUrl(config.API_URL);
    urlObj.protocol = apiUrl.protocol;
    urlObj.authority = apiUrl.authority;

    if (urlObj.protocol === 'http') {
        const i = urlObj.params.indexOf('secure');
        if (i >= 0) urlObj.params.splice(i, 1);
    }

    if (apiUrl.path !== '/') {
        urlObj.path = `${apiUrl.path}${urlObj.path}`;
    }

    if (!config.REQUIRE_ACCESS_TOKEN) return formatUrl(urlObj);

    accessToken = accessToken || config.ACCESS_TOKEN || config.accessToken;

    urlObj.params = urlObj.params.filter((d) => d.indexOf('access_token') === -1 && d.indexOf('ak') === -1);
    //urlObj.params.push(`access_token=${accessToken || ''}`);
    urlObj.params.push(`ak=${accessToken || ''}`);
    return formatUrl(urlObj);
}

/**
 * 处理和转换资源url
 * 适配msp的url转换器
 * @param url
 * @param resourceType
 * @param accessToken
 * http://121.36.99.212:35001/webglapi/styles?n=mapabc80&addSource=true&sourceType=http&ak=ec85d3648154874552835438ac6a02b2
 * return {
 *     url: string;
 *     headers?: any;
 *     method?: 'GET' | 'POST' | 'PUT';
 *     body?: string;
 *     type?: 'string' | 'json' | 'arrayBuffer';
 *     credentials?: 'same-origin' | 'include';
 *     collectResourceTiming?: boolean;
 * }
 */
const mspTransformRequestFunc: RequestTransformFunctionCustom = (url: string, resourceType?: ResourceType, accessToken?: string | null | void) => {
    //console.log('private protocol url =>' ,url, resourceType)
    let resultRequest = {
        url: url
    };
    /**
     * 地图样式资源url
     */
    if (resourceType === 'Style') {
        if (!isMapboxURL(url) && !isHttpURL(url)) {
            url = `mapabc://style/${url}`;
        }
        if (isHttpURL(url)) {
            resultRequest.url = url;
        } else {
            const urlObject = parseUrl(url);
            //urlObject.path = `/styles/v1${urlObject.path}`;
            let styleName = urlObject.path.replace('/', '');
            urlObject.params.push(`n=${styleName}`);
            urlObject.params.push(`addSource=true`);
            urlObject.params.push(`sourceType=http`);
            urlObject.authority = config.API_URL;
            urlObject.path = '/webglapi/styles';
            resultRequest.url = makeAPIURL(urlObject, accessToken);//`${config.API_URL}/webglapi/styles?n=${url}&addSource=true&sourceType=http&ak=${config.ACCESS_TOKEN}`;
        }
    }
    /**
     * 图标集合json文件
     */
    if (resourceType === 'SpriteJSON' || resourceType === 'SpriteImage') {
        let spriteFileType = resourceType === 'SpriteJSON' ? 'json' : 'png';
        if (!isMapboxURL(url) && !isHttpURL(url)) {
            url = `mapabc://sprites/${url}.${spriteFileType}`;
        }
        if (isHttpURL(url)) {
            resultRequest.url = url;
        } else {
            const urlObject = parseUrl(url);
            //urlObject.path = `/styles/v1${urlObject.path}`;
            let spriteName = urlObject.path.replace('/', '').replace('.json', '').replace('.png', '');
            urlObject.params.push(`n=${spriteName}`);
            urlObject.params.push(`e=${spriteFileType}`);
            urlObject.authority = config.API_URL;
            urlObject.path = '/webglapi/sprite';
            resultRequest.url = makeAPIURL(urlObject, accessToken);//http://121.36.99.212:35001/webglapi/sprite?n=mapabcjt@2x&e=json&ak=ec85d3648154874552835438ac6a02b2
        }
    }

    if (resourceType === 'Glyphs') {
        if (!isMapboxURL(url) && !isHttpURL(url)) {
            url = `mapabc://glyphs/${url}/{range}.pbf`;
        }
        if (isHttpURL(url)) {
            resultRequest.url = url;
        } else {
            const urlObject = parseUrl(url);
            //path: "/sourcehansanscn-normal/8192-8447.pbf"
            let fontInfoArr = urlObject.path.split('/');
            let fontstack = fontInfoArr[1];
            let range = fontInfoArr[2].split('.')[0];
            urlObject.params.push(`n=${fontstack}`);
            urlObject.params.push(`r=${range}`);
            urlObject.authority = config.API_URL;
            urlObject.path = '/webglapi/fonts';
            resultRequest.url = makeAPIURL(urlObject, accessToken); // Request URL: http://121.36.99.212:35001/webglapi/fonts?n=sourcehansanscn-normal&r=0-255&ak=ec85d3648154874552835438ac6a02b2
        }
    }

    if (resourceType === 'Image') {

    }

    if (resourceType === 'Tile') {
        /**
         * tile 数据 url中没有ak参数
         */
        if (url.indexOf("ak=") == -1) {
            const urlObject = parseUrl(url);
            if (!config.REQUIRE_ACCESS_TOKEN) {
                resultRequest.url = formatUrl(urlObject);
            } else {
                accessToken = accessToken || config.ACCESS_TOKEN;
                //urlObject.params.push(`access_token=${accessToken || ''}`);
                urlObject.params.push(`ak=${accessToken || ''}`);
                resultRequest.url = formatUrl(urlObject);
            }
        }
    }

    if (resourceType === 'Unknown') {

    }

    if (resourceType === 'Source' && url.indexOf('http://myHost') > -1) {
        //console.log('request Source url - > ', url);
        return {
            url: url.replace('http', 'https'),
            headers: {'my-custom-header': true},
            credentials: 'include'  // Include cookies for cross-origin requests
        };
    }
//console.log('target resource url =>' ,resultRequest.url, resourceType)
    return resultRequest;
};

function isMapboxURL(url: string) {
    return url.indexOf('mapbox:') === 0 || url.indexOf('mapabc:') === 0 || url.indexOf('amap:') === 0;
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

export {parseUrl, formatUrl, makeAPIURL};
