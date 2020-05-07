import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const NODE_ENV = process.env.NODE_ENV || "development";
const outputFile = NODE_ENV === "production" ? "./build/prod.js" : "./build/dev.js";
const externals = {react: 'React', 'react-dom': 'ReactDOM'};

export default {
    input: "index.js",
    external: Object.keys(externals),
    output: {
        file: outputFile,
        format: 'umd',
        name: 'ReactNodeGraphHook',
        globals: externals
    },
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