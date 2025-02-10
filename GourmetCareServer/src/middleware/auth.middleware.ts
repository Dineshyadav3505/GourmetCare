import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtToken";
import { getUserByEmailModel } from "../models/user.model";

// Verify the JWT token
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

// Verify the technician's role
export const technicianVerification = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRole = res.locals.user.role;
    if (
      userRole === "technician" &&
      userRole === "manager" &&
      userRole === "admin" &&
      userRole === "superAdmin"
    ) {
      throw new ApiError(403, "Unauthorized request");
    }
    next();
  }
);

// Verify the manager's role
export const managerVerification = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRole = res.locals.user.role;
    if (
      userRole !== "manager" &&
      userRole !== "admin" &&
      userRole !== "superAdmin"
    ) {
      next();
    }
      throw new ApiError(403, "Unauthorized request");
  }
);

// Verify the admin's role
export const adminVerification = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRole = res.locals.user.role;
    if (userRole !== "admin" && userRole !== "superAdmin") {
      throw new ApiError(403, "Unauthorized request");
    }
    next();
  }
);

// Verify the super admin's role
export const superAdminVerification = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRole = res.locals.user.role;
    if (userRole !== "superAdmin") {
      throw new ApiError(403, "Unauthorized request");
    }
    next();
  }
);
