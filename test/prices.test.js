import {extractPrices} from '../api/prices.js'
import elering from './elering.js'
import assert from 'assert'

assert.deepStrictEqual(extractPrices(elering, 'EE', 1)['2024-11-16'], [
  1.58,     0,     0, -0.01,    0,
  0.03,     0,  5.29,  5.78,  5.7,
  0,     0,  0.01,  0.34, 1.52,
  3.28, 13.85, 19.63, 12.03,  3.5,
  0.62,  0.01,  0.04,  0.01
])
