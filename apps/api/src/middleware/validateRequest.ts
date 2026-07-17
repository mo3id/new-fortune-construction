import { NextFunction, Request, RequestHandler, Response } from 'express';
import { z, ZodSchema } from 'zod';

interface RequestSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

export function validateRequest(schemas: RequestSchemas): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (schemas.body) req.body = schemas.body.parse(req.body);
    if (schemas.params) req.params = schemas.params.parse(req.params) as z.infer<NonNullable<typeof schemas.params>>;
    if (schemas.query) req.query = schemas.query.parse(req.query) as z.infer<NonNullable<typeof schemas.query>>;
    next();
  };
}
