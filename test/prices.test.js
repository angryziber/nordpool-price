import {extractPrices} from '../api/prices.js'
import marketdata from './marketdata.js'
import assert from 'assert'

assert.deepStrictEqual(extractPrices(marketdata)['2020-12-12'], [
  44.77, 28.04, 19.67, 19.25,
  25.06, 30.03, 30.38, 44.73,
  46.19, 46.61, 56.94, 50.07,
  52.66, 49.95, 74.37, 75.04,
  77.2, 72.85, 70.63,  68.1,
  48.27, 46.39, 44.79
])
