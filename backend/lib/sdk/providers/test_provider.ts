import { expect as jestExpect } from 'expect'
import jestExtendedMatchers from 'jest-extended'
import CustomMatchers from 'jest-extended'
import { HttpResponseMatchers } from '../types/test.js'
import * as matchers from '../src/expect/main.js'
import 'expect'

type JestExtendedMatchers = typeof CustomMatchers

declare module 'expect' {
  export interface Matchers<R extends void | Promise<void>, T = unknown>
    extends JestExtendedMatchers,
      HttpResponseMatchers {}
}

jestExpect.extend(jestExtendedMatchers)
jestExpect.extend(matchers)
