import { Request, Response, NextFunction } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (requestHandler: AsyncRequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await requestHandler(req, res, next);
        } catch (error) {
            const typedError = error as Error & { code?: number };
            res.status(typedError.code || 500).json({
                success: false,
                message: typedError.message || 'An unexpected error occurred',
            });
        }
    };
};
