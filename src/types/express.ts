// Express type extensions
import { Request } from 'express';

export type TypedRequest<
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown
> = Request<TParams, unknown, TBody, TQuery>;