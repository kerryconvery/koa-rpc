// Contents of the file /rollup.config.js
import typescript from '@rollup/plugin-typescript';
import dts from "rollup-plugin-dts";
import generatePackageJson from 'rollup-plugin-generate-package-json'

const config = [
  {
    input: 'build/rpc-client.js',
    output: {
      file: 'dist/rpc-client.js',
      sourcemap: false,
    },
    plugins: [
      typescript(),
      generatePackageJson({
        outputFolder: 'dist',
        baseContents: {
          "name": "koa-rpc",
          "version": "1.0.0",
          "description": "",
          "main": "rpc-client.js",
          "types": "rpc-client.d.ts",
          "peerDependencies": {
            "koa": "^2.15.3",
            "koa-router": "^12.0.1",
            "zod": "^3.23.8"
          },
        }
      })
    ]
  },
  {
    input: 'build/rpc-client.d.ts',
    output: {
      file: 'dist/rpc-client.d.ts',
      sourcemap: false,
    },
    plugins: [
      dts()
    ]
  },
  {
    input: 'build/types.js',
    output: {
      file: 'dist/types.js',
      sourcemap: false,
    },
    plugins: [
      typescript()
    ]
  },
  {
    input: 'build/routeDefinition.js',
    output: {
      file: 'dist/routeDefinition.js',
      sourcemap: false,
    },
    plugins: [
      typescript()
    ]
  },
  {
    input: 'build/rpc/client-side.js',
    output: {
      file: 'dist/rpc/client-side.js',
      sourcemap: false,
    },
    plugins: [
      typescript()
    ]
  },
  {
    input: 'build/rpc/types.js',
    output: {
      file: 'dist/rpc/types.js',
      sourcemap: false,
    },
    plugins: [
      typescript()
    ]
  },
];
export default config;