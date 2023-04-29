import fs from 'fs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import {plugins} from './build/rollup_plugins';
import replace from '@rollup/plugin-replace';
import banner from './build/banner';
import bannerMapAbc from './build/banner-mapabc';
import bannerTopsmap from './build/banner-topsmap';
import bannerAmap from './build/banner-amap';
import {RollupOptions} from 'rollup';
//import {importAssertions} from 'acorn-import-assertions';

const {BUILD, MAPABC, EXPORTNAMESPACE} = process.env;
const production = BUILD === 'production';

/**
 * 从命令行参数中获取打包命名空间名称
 * 可能是 mapabc|maplibre|amap|topsmap
 */
let nameSpace = 'maplibre';
if (EXPORTNAMESPACE == undefined) {
    console.log("未指定 EXPORTNAMESPACE 参数 使用默认参数 maplibre")
} else {
    nameSpace = EXPORTNAMESPACE;
    console.log("指定 EXPORTNAMESPACE 参数 打包命名空间名称为 -> " + nameSpace)

}
// 是否打包成mapabcgl命名空间
//const buildMapAbc = MAPABC === 'true';

//const nameSpace = buildMapAbc ? 'mapabc' : 'maplibre';

let fileBanner = banner;

if (nameSpace == 'mapabc') {
    fileBanner = bannerMapAbc;
} else if (nameSpace == 'amap') {
    fileBanner = bannerAmap;
} else if (nameSpace == 'topsmap') {
    fileBanner = bannerTopsmap;
} else {
    fileBanner = banner;
}

/**
 * 根据配置的变量计算生成的文件名称
 * @param production
 * @param nameSpace
 */
function getOutputFile(production, nameSpace) {
    return production ? 'dist/' + nameSpace + '-gl.js' : 'dist/' + nameSpace + '-gl-dev.js';
}

// 文件名称
const outputFile = getOutputFile(production, nameSpace);

/**
 * 打包配置插件
 */
let pluginsForRollup = plugins(production);
let pluginsForRollup2 = production ? [] : [
    // Ingest the sourcemaps produced in the first step of the build.
    // This is the only reason we use Rollup for this second pass
    sourcemaps()
];

/**
 * 根据命名空间名称 获取替换字符串配置信息
 * @param nameSpace
 */
function getReplaceOptionByNameSpace(nameSpace: string) {
    let forReplaceOption = {};

    if (nameSpace == 'mapabc') {
        forReplaceOption = {
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
            'mapboxgl': 'mapabcgl',
            'mapbox-gl': 'mapabc-gl',
            'mapbox': 'mapabc',
            'Mapbox': 'MapAbc',
        }
    } else if (nameSpace == 'amap') {
        forReplaceOption = {
            'https://maplibre.org/maplibre-gl-js-docs': 'https://www.amap.com/amap-gl-js-docs',
            'github.com/maplibre/maplibre-gl-js': 'github.com/amap/amap-gl-js',
            'https://www.maplibre.org': 'https://www.amap.com',
            '.maplibre.org': '.amap.com',
            'maplibre.org': 'amap.com',
            'maplibregl': 'amapgl',
            'maplibre-gl': 'amap-gl',
            'MapLibre': 'Amap',
            'maplibre': 'amap',
            'mapboxGlSupported': 'amapGlSupported',
            'mapboxgl': 'amapgl',
            'mapbox-gl': 'amap-gl',
            'mapbox': 'amap',
            'Mapbox': 'Amap',
            'mapabcgl': 'amapgl',
            'mapabc': 'amap',
            'MapAbc': 'Amap',
        }
    } else if (nameSpace == 'topsmap') {
        forReplaceOption = {
            'https://maplibre.org/maplibre-gl-js-docs': 'https://www.topsmap.com/topsmap-gl-js-docs',
            'github.com/maplibre/maplibre-gl-js': 'github.com/topsmap/topsmap-gl-js',
            'https://www.maplibre.org': 'https://www.topsmap.com',
            '.maplibre.org': '.topsmap.com',
            'maplibre.org': 'topsmap.com',
            'maplibregl': 'topsmapgl',
            'maplibre-gl': 'topsmap-gl',
            'MapLibre': 'Topsmap',
            'maplibre': 'topsmap',
            'mapboxGlSupported': 'topsmapGlSupported',
            'mapboxgl': 'topsmapgl',
            'mapbox-gl': 'topsmap-gl',
            'mapbox': 'topsmap',
            'Mapbox': 'Topsmap',
            'mapabcgl': 'topsmapgl',
            'mapabc': 'topsmap',
            'MapAbc': 'Topsmap',
        }
    } else {
        forReplaceOption = {}
    }

    return forReplaceOption;
}

/**
 * 如果打包命名空间不是默认的maplibre，需要设置替换字符串
 */
if (nameSpace != 'maplibre') {
    const forReplaceOption = getReplaceOptionByNameSpace(nameSpace);
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
    // - staging/maplibregl/index.js: the main module, plus all its dependencies not shared by the worker module
    // - staging/maplibregl/worker.js: the worker module, plus all dependencies not shared by the main module
    // - staging/maplibregl/shared.js: the set of modules that are dependencies of both the main module and the worker module
    //
    // This is also where we do all of our source transformations using the plugins.
    input: ['src/index.ts', 'src/source/worker.ts'],
    output: {
        dir: 'staging/' + nameSpace + 'gl',
        format: 'amd',
        sourcemap: 'inline',
        indent: false,
        chunkFileNames: 'shared.js'
    },
    onwarn: (message) => {
        console.error(message);
        throw message;
    },
    treeshake: production,
    //acornInjectPlugins: [importAssertions],
    plugins: pluginsForRollup
}, {
    // Next, bundle together the three "chunks" produced in the previous pass
    // into a single, final bundle. See rollup/bundle_prelude.js and
    // rollup/maplibregl.js for details.
    input: 'build/rollup/' + nameSpace + 'gl.js',
    output: {
        name: nameSpace + 'gl', // 生成命名空间名称
        file: outputFile,
        format: 'umd',
        sourcemap: true,
        indent: false,
        intro: fs.readFileSync('./build/rollup/bundle_prelude_' + nameSpace + 'gl.js', 'utf8'),
        banner: fileBanner
    },
    treeshake: false,
    plugins: pluginsForRollup2, //替換字符插件用在第二部打包
}];

export default config;
