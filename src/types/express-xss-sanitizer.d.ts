declare module 'express-xss-sanitizer' {
  import { RequestHandler } from 'express';
  
  interface XssOptions {
    whiteList?: Record<string, string[]>;
    stripIgnoreTag?: boolean;
    stripIgnoreTagBody?: string[];
    css?: boolean;
  }
  
  function xss(options?: XssOptions): RequestHandler;
  export = xss;
}
