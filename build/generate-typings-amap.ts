
import fs from 'fs';
import childProcess from 'child_process';

if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}
let forReplaceOption = {
    'https://maplibre.org/maplibre-gl-js-docs': 'https://www.amap.com/amap-gl-js-docs',
    'github.com/maplibre/maplibre-gl-js': 'amap.com/amap-gl-js',
    'https://www.maplibre.org': 'https://www.amap.com',
    '.maplibre.org': '.amap.com',
    'maplibre.org': 'amap.com',
    'maplibregl': 'amapgl',
    'maplibre-gl': 'amap-gl',
    'MapLibre': 'Amap',
    'maplibre': 'amap',
    'mapboxGlSupported': 'amapGlSupported',
    'mapboxHTTPURLRegex': 'amapHTTPURLRegex',
    'mapboxgl': 'amapgl',
    'mapbox-gl': 'amap-gl',
    'mapbox': 'amap',
    'mapabc': 'amap',
    'Mapbox': 'Amap',
}
console.log('Starting bundling types');
let outputFile = './dist/amap-gl.d.ts';
childProcess.execSync(`dts-bundle-generator --umd-module-name=amapgl -o ${outputFile} ./src/index.ts`);
let types = fs.readFileSync(outputFile, 'utf8');
// Classes are not exported but should be since this is exported as UMD - fixing...
types = types.replace(/declare class/g, 'export declare class');
for (const forReplaceOptionKey in forReplaceOption) {
    types = types.replaceAll(forReplaceOptionKey, forReplaceOption[forReplaceOptionKey]);
}

fs.writeFileSync(outputFile, types);

console.log('Finifhed bundling types for amap-gl starting style-spec');

const outputPath = './dist/style-spec';
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}
outputFile = `${outputPath}/index.d.ts`;
childProcess.execSync(`dts-bundle-generator -o ${outputFile} ./src/style-spec/types.g.ts`);

console.log('Finished bundling types');
