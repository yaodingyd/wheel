import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
// import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

const banner = `/*
* wheel-mvvm v${pkg.version}
*
* @license MIT
* @author yding
*/`

export default [
  {
    input: 'src/index.ts',
    name: 'wheel',
    output: {
      file: pkg.browser,
      format: 'umd',
      banner,
      sourcemap: true
    },
    plugins: [
      typescript(),
      resolve(), // for locating module in node_modules
      commonjs(), // for converting commonjs to ES5,
      // uglify()
    ]
  },
  {
    input: 'src/index.ts',
    name: 'wheel',
    output: 
      {
        file: pkg.main,
        format: 'cjs',
        banner
      },
    plugins: [
      typescript()
    ]
  },
  {
    input: 'src/index.ts',
    name: 'wheel',
    output: 
      {
        file: pkg.module,
        format: 'es',
        banner
      },
    plugins: [
      typescript()
    ]
  } 
]