import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            error: 'Validation Error',
            details: error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }))
        });
    }

    console.error(error);

    return res.status(500).json({ error: 'Internal Server Error' });
}