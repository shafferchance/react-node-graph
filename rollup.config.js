import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const NODE_ENV = process.env.NODE_ENV || "development";
const externals = {react: 'React', 'react-dom': 'ReactDOM'};

export default {
    input: "index.js",
    external: Object.keys(externals),
    output: [
        {
            file: "build/umd/index.js",
            format: 'umd',
            name: 'ReactNodeGraphHook',
            globals: externals
        },
        {
            file: "build/cjs/index.js",
            format: 'cjs',
            name: "ReactNodeGraphHook",
            globals: externals
        },
        {
            file: "build/esm/index.js",
            format: "es",
            name: "ReactNodeGraphHook",
            globals: externals
        }
    ],
    plugins: [
        babel({
            exclude: "node_modules/**",
            extensions: [".js", ".jsx"],
            runtimeHelpers: true
        }),
        resolve({
            include: ["node_modules/**"],
            exclude: ["node_modules/process-es6/**", "node_modules/react-is/**"]
        }),
        commonjs(),
        replace({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
        })        
    ]
}