import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtToken";


export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = 
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = verifyToken(token);

    res.locals.user = decodedToken;
    next();
});
