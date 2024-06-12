
import fs from 'fs';
import childProcess from 'child_process';

if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}
let forReplaceOption = {
    'https://maplibre.org/maplibre-gl-js-docs': 'https://www.mapabc.com/mapabc-gl-js-docs',
    'github.com/maplibre/maplibre-gl-js': 'github.com/mapabc/mapabc-gl-js',
    'https://www.maplibre.org': 'https://www.mapabc.com',
    '.maplibre.org': '.mapabc.com',
    'maplibre.org': 'mapabc.com',
    'maplibregl': 'mapabcgl',
    'maplibre-gl': 'mapabc-gl',
    'MapLibre': 'MapAbc',
    'maplibre': 'mapabc',
    'mapboxGlSupported': 'mapabcGlSupported',
    'mapboxHTTPURLRegex': 'mapabcHTTPURLRegex',
    'mapboxgl': 'mapabcgl',
    'mapbox-gl': 'mapabc-gl',
    'mapbox': 'mapabc',
    'Mapbox': 'MapAbc',
}
console.log('Starting bundling types');
let outputFile = './dist/mapabc-gl.d.ts';
childProcess.execSync(`dts-bundle-generator --umd-module-name=mapabcgl -o ${outputFile} ./src/index.ts`);
let types = fs.readFileSync(outputFile, 'utf8');
// Classes are not exported but should be since this is exported as UMD - fixing...
types = types.replace(/declare class/g, 'export declare class');
for (const forReplaceOptionKey in forReplaceOption) {
    types = types.replaceAll(forReplaceOptionKey, forReplaceOption[forReplaceOptionKey]);
}

fs.writeFileSync(outputFile, types);

console.log('Finifhed bundling types for mapabc-gl starting style-spec');

const outputPath = './dist/style-spec';
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}
outputFile = `${outputPath}/index.d.ts`;
childProcess.execSync(`dts-bundle-generator -o ${outputFile} ./src/style-spec/types.g.ts`);

console.log('Finished bundling types');
