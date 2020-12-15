import {closeTags} from "../../static/deps/closeTags.js";
import * as assert from "assert";

assert.deepStrictEqual(closeTags(['<mega-tag hello="1"', ' world="2"/><another-tag', '/> <select', '></select> <third', '/>']),
  ['<mega-tag hello="1"', ' world="2"></mega-tag><another-tag', '></another-tag> <select', '></select> <third', '></third>'])
