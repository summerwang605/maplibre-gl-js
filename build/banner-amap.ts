import fs from 'fs';

const version = JSON.parse(fs.readFileSync('package.json').toString()).version;
export default `/* Amap GL JS 矢量地图服务 JavaScript. https://www.amap.com/sdk/amap-gl-js/v${version}.txt */`;
