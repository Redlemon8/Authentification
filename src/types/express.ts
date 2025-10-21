// types/express.ts
import { Request } from 'express';

export type TypedRequest<
  TBody = unknown,
  TParams = Record<string, never>,
  TQuery = unknown
> = Request<TParams, unknown, TBody, TQuery>;

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}