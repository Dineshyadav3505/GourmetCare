import { Request, Response } from "express";
import {
  createUsersTable,
  createUser as createUserModel,
  getUserById as getUserByIdModel,
  getUserByEmail as getUserByEmailModel,
  updateUser as updateUserModel,
  deleteUser as deleteUserModel,
  User,
} from "../../models/user.model";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { userSchema, loginSchema } from "../../utils/schemaValidation";
import { getAccessToken } from "../../utils/jwtToken";
import {
  generateVerificationCode,
  verifyCode,
} from "../../utils/optValidation";
import { storeVerificationEmailCode } from "../../utils/optValidation";
import { storeVerificationPhoneCode } from "../../utils/optValidation";
import { options } from "../../utils/schemaValidation";
import cookieParser from "cookie-parser";

// Verify the user's email or phone number
export const sendVerificationCode = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      throw new ApiError(400, "Either email or phone number is required");
    }

    let verificationCode;

    if (email) {
      verificationCode = generateVerificationCode();
      storeVerificationEmailCode(email, verificationCode);
    }
    if (phoneNumber) {
      console.log("phone");
      verificationCode = generateVerificationCode();
      storeVerificationPhoneCode(phoneNumber, verificationCode);
    }

    res.status(201).json(
      new ApiResponse(201, "OTP sent successfully", {
        email: email,
        code: verificationCode,
      })
    );
  }
);

// Create a new user
export const createUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    await createUsersTable();

    const { first_name, last_name, email, phoneNumber, code } = req.body;

    // Validate user input against schema
    const { error } = userSchema.validate({
      first_name,
      last_name,
      email,
      phoneNumber,
      code,
    });
    if (error) {
      throw new ApiError(400, error.details[0].message, false, [
        error.details[0].message,
      ]);
    }

    const existingUser = await getUserByEmailModel(email);

    if (existingUser) {
      res.status(409).json({ message: "User with this email already exists" });
      return;
    }

    // Validate verification code
    if (!code) {
      throw new ApiError(400, "Verification code is required");
    }

    const isCodeValid = verifyCode(email, code);

    if (!isCodeValid) {
      res.status(400).json({ message: "Invalid verification code" });
      return;
    }

    const accessToken = getAccessToken(email);

    const newUser = { first_name, last_name, email, phoneNumber };
    const user = await createUserModel(newUser);

    res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(201, "User created successfully", { user, accessToken })
      );
  }
);

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  // try {
  //   const userId = parseInt(req.params.id);
  //   const user = await getUserByIdModel(userId);
  //   if (user) {
  //     res.status(200).json({ user });
  //   } else {
  //     res.status(404).json({ message: 'User not found' });
  //   }
  // } catch (error) {
  //   handleError(res, error);
  // }
};

export const getUserByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  // try {
  //   const userEmail = req.params.email;
  //   const user = await getUserByEmailModel(userEmail);
  //   if (user) {
  //     res.status(200).json({ user });
  //   } else {
  //     res.status(404).json({ message: 'User not found' });
  //   }
  // } catch (error) {
  //   handleError(res, error);
  // }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  // try {
  //   const userId = parseInt(req.params.id);
  //   const updatedUserData: Partial<User> = req.body;
  //   const updatedUser = await updateUserModel(userId, updatedUserData);
  //   if (updatedUser) {
  //     res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  //   } else {
  //     res.status(404).json({ message: 'User not found' });
  //   }
  // } catch (error) {
  //   handleError(res, error);
  // }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  // try {
  //   const userId = parseInt(req.params.id);
  //   const result = await deleteUserModel(userId);
  //   res.status(200).json({ message: result });
  // } catch (error) {
  //   handleError(res, error);
  // }
};

// Login user
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, code } = req.body;

    const { error } = loginSchema.validate({ email, code });
    if (error) {
      console.log("error", error);
      throw new ApiError(400, error.details[0].message, false, [
        error.details[0].message,
      ]);
    }

    const user = await getUserByEmailModel(email);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isCodeValid = verifyCode(email, code);

    if (!isCodeValid) {
      throw new ApiError(400, "Invalid verification code");
    }

    const accessToken = getAccessToken(email);

    res.status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user,
        accessToken,
      })
    );
  }
);

// Logout user
export const logout = async (_req: Request, res: Response): Promise<void> => {
  console.log(res.locals.user.email);
  res.status(200)
  // .clearCookie("accessToken", options)
  .json(
    new ApiResponse(201, "User Successfully LogOut", {})
  );
};
