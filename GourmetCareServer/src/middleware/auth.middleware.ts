import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtToken";
import { getUserByEmailModel} from "../models/user.model";

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }          
    const decodedToken = verifyToken(token);
    const user = await getUserByEmailModel(decodedToken.email);
    res.locals.user = user;
    next();
  }
);
