import fs from 'fs';

const version = JSON.parse(fs.readFileSync('package.json').toString()).version;
export default `/* MapAbc GL JS 矢量地图服务 JavaScript. https://www.mapabc.com/sdk/mapabc-gl-js/v${version}.txt */`;
