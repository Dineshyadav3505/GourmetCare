import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from './apiResponse';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (requestHandler: AsyncRequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await requestHandler(req, res, next);
        } catch (error: any) {
            console.log('error', error);
            res.status(error.statusCode ).json(new ApiResponse(error.code , error.message, error, error.success));      
        }
    };
}
