import fs from 'fs';
import { ErrorRequestHandler, Request, Response } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';
import { safeLogger } from '../utils/safeLogger';
import { redactClientValue } from '../utils/redaction';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code = 'API_ERROR',
    public details?: Array<{ field?: string; message: string }>
  ) {
    super(message);
  }
}

export function sendApiError(
  res: Response,
  statusCode: number,
  message: string,
  code: string,
  details?: Array<{ field?: string; message: string }>
): void {
  res.status(statusCode).json({
    message: redactClientValue(message),
    code,
    ...(details && details.length > 0
      ? {
          details: details.map((detail) => ({
            ...detail,
            message: redactClientValue(detail.message),
          })),
        }
      : {}),
  });
}

function zodDetails(error: ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}

function uploadedFiles(req: Request): Express.Multer.File[] {
  const files: Express.Multer.File[] = [];
  if (req.file) files.push(req.file);
  if (Array.isArray(req.files)) files.push(...req.files);
  if (req.files && !Array.isArray(req.files)) {
    for (const fieldFiles of Object.values(req.files)) {
      files.push(...fieldFiles);
    }
  }
  return files;
}

function cleanupUploadedFiles(req: Request): void {
  for (const file of uploadedFiles(req)) {
    if (!file.path || !fs.existsSync(file.path)) continue;
    try {
      fs.unlinkSync(file.path);
    } catch (cleanupError) {
      safeLogger.error('Failed to remove uploaded file after request error.', cleanupError);
    }
  }
}

export const notFoundHandler = (_req: Request, res: Response): void => {
  sendApiError(res, 404, 'Not found', 'NOT_FOUND');
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (res.headersSent) return;
  cleanupUploadedFiles(_req);

  if (error instanceof ApiError) {
    sendApiError(res, error.statusCode, error.message, error.code, error.details);
    return;
  }

  if (error instanceof ZodError) {
    sendApiError(res, 400, 'Invalid request', 'VALIDATION_ERROR', zodDetails(error));
    return;
  }

  if (error instanceof multer.MulterError) {
    sendApiError(res, 400, 'Invalid upload', 'UPLOAD_VALIDATION_ERROR');
    return;
  }

  safeLogger.error('Unexpected API error', error);
  sendApiError(res, 500, 'Unexpected server error', 'INTERNAL_ERROR');
};
