import fs from 'fs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import {plugins} from './build/rollup_plugins';
import replace from '@rollup/plugin-replace';
import banner from './build/banner';
import bannerMapAbc from './build/banner-mapabc';
import {RollupOptions} from 'rollup';
import {importAssertions} from 'acorn-import-assertions';

const {BUILD, MAPABC} = process.env;
const production = BUILD === 'production';

// 是否打包成mapabcgl命名空间
const buildMapAbc = MAPABC === 'true';

const nameSpace = buildMapAbc ? 'mapabc' : 'maplibre';

let fileBanner = (buildMapAbc ? bannerMapAbc : banner);

/**
 * 根据配置的变量计算生成的文件名称
 * @param production
 * @param buildMapAbc
 */
function getOutputFile(production, buildMapAbc) {
    return production ? 'dist/' + nameSpace + '-gl.js' : 'dist/' + nameSpace + '-gl-dev.js';
}

// 文件名称
const outputFile = getOutputFile(production, buildMapAbc);

/**
 * 打包配置插件
 */
let pluginsForRollup = plugins(production);
let pluginsForRollup2 = production? []:[
    // Ingest the sourcemaps produced in the first step of the build.
    // This is the only reason we use Rollup for this second pass
    sourcemaps()
];

if (buildMapAbc) {

    const forReplaceOption = {
        'maplibregl': 'mapabcgl',
        'maplibre-gl': 'mapabc-gl',
        'github.com/maplibre/maplibre-gl-js': 'github.com/mapabc/mapabc-gl-js',
        'MapLibre': 'MapAbc',
        'https://maplibre.org/maplibre-gl-js-docs': 'https://www.mapabc.com/mapabc-gl-js-docs',
        'https://www.maplibre.org': 'https://www.mapabc.com',
        '.maplibre.org': '.mapabc.com',
        'maplibre': 'mapabc',
        'mapboxGlSupported': 'mapabcGlSupported',
        'mapboxgl': 'mapabcgl',
        'mapbox-gl': 'mapabc-gl',
        'mapbox': 'mapabc',
        'Mapbox': 'MapAbc',
    };

    for (const forReplaceOptionKey in forReplaceOption) {
        console.log(`打包类库替换字符串 ${forReplaceOptionKey}  ->  ${forReplaceOption[forReplaceOptionKey]}`);
    }

    /**
     * 设置类库打包时源码中替换的字符串
     * 源字符串 -> 目标字符串
     */
    pluginsForRollup2.push(replace({
        preventAssignment: true,
        __buildDate__: () => JSON.stringify(new Date()),
        delimiters: ['', ''],
        values: forReplaceOption
    }));
}

const config: RollupOptions[] = [{
    // Before rollup you should run build-tsc to transpile from typescript to javascript (except when running rollup in watch mode)
    // Rollup will use code splitting to bundle GL JS into three "chunks":
    // - rollup/build/maplibregl/index.js: the main module, plus all its dependencies not shared by the worker module
    // - rollup/build/maplibregl/worker.js: the worker module, plus all dependencies not shared by the main module
    // - rollup/build/maplibregl/shared.js: the set of modules that are dependencies of both the main module and the worker module
    //
    // This is also where we do all of our source transformations using the plugins.
    input: ['src/index.ts', 'src/source/worker.ts'],
    output: {
        dir: 'rollup/build/' + nameSpace + 'gl',
        format: 'amd',
        sourcemap: 'inline',
        indent: false,
        chunkFileNames: 'shared.js'
    },
    treeshake: production,
    acornInjectPlugins: [importAssertions],
    plugins: pluginsForRollup
}, {
    // Next, bundle together the three "chunks" produced in the previous pass
    // into a single, final bundle. See rollup/bundle_prelude.js and
    // rollup/maplibregl.js for details.
    input: 'rollup/' + nameSpace + 'gl.js',
    output: {
        name: nameSpace + 'gl', // 生成命名空间名称
        file: outputFile,
        format: 'umd',
        sourcemap: production ? true : 'inline',
        indent: false,
        intro: fs.readFileSync('./rollup/bundle_prelude_' + nameSpace + 'gl.js', 'utf8'),
        banner: fileBanner
    },
    treeshake: false,
    plugins: pluginsForRollup2, //替換字符插件用在第二部打包
}];

export default config;
