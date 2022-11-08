import { TypeResponseParserFn } from "../types";

export interface ConfigBaseInterface {
  /**
   * Response Parse
   *
   * @type {Function}
   */
  parser?: TypeResponseParserFn;
}
