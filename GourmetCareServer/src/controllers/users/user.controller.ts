import { Request, Response } from "express";
import {
  createUsersTable,
  createUserModel,
  getUserByIdModel,
  getUserByEmailModel,
  updateUserModel,
  deleteUserModel,
  getAllUsersMode,
  User,
  updateUserByAdminModel,
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

// Verify the user's email or phone number
export const sendVerificationCode = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, phone_number } = req.body;

    if (!email && !phone_number) {
      throw new ApiError(400, "Either email or phone number is required");
    }

    let verificationCode;

    if (email) {
      verificationCode = generateVerificationCode();
      storeVerificationEmailCode(email, verificationCode);
    }
    if (phone_number) {
      console.log("phone");
      verificationCode = generateVerificationCode();
      storeVerificationPhoneCode(phone_number, verificationCode);
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

    const { first_name, last_name, email, phone_number, code } = req.body;

    // Validate user input against schema
    const { error } = userSchema.validate({
      first_name,
      last_name,
      email,
      phone_number,
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

    const newUser = { first_name, last_name, email, phone_number };
    console.log("newUser", newUser);
    const user = await createUserModel(newUser);

    if (!user) {
      throw new ApiError(500, "Error creating user");
    }

    res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(201, "User created successfully", { user, accessToken })
      );
  }
);

// Get user by email
export const  currentUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user;

    if((!user)){
      throw new ApiError(404, "User not found");
    }
      res.status(200).json(new ApiResponse(200, "User found", { user }));
  }
);

// Update user
export const updateUser = asyncHandler( 
  async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user;
    const updatedUserData: Partial<User> = req.body;
    const updatedUser = await updateUserModel(user.id, updatedUserData);
    if (updatedUser) {
      res.status(200).json(
        new ApiResponse(200, "User updated successfully", {
          user: updatedUser,
        })
      );
    } else {
      throw new ApiError(404, "User not found");
    }
  }
);

// Delete user
export const deleteUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userEmail = res.locals.user.email;
    const userId = res.locals.user.id;
    const user = await getUserByEmailModel(userEmail);
    
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const deletedUser = await deleteUserModel(userId);
    res.status(200).json(new ApiResponse(200, "User deleted successfully", {deletedUser}));
  }
);

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

    res
      .status(200)
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
  res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(201, "User Successfully LogOut", {}));
};





// ADMIN
// Get all users
export const getAllUsers = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const currentUserId = res.locals.user.id;
    const users = await getAllUsersMode();
    if (!users) {
      throw new ApiError(404, "Users not found");
    }
    // Filter out the current user from the users array
    const filteredUsers = users.filter(user => user.id !== currentUserId || user.role === "superAdmin");
    res.status(200).json(new ApiResponse(200, "Users found", { users: filteredUsers }));
  }
);

// Get users by id
export const getUserById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);
    const user = await getUserByIdModel(userId);
    if (!user) {
      throw new ApiError(404, "Users not found");
    } 
    res.status(200).json(new ApiResponse(200, "Users found", { user }));
    
  }
);

// Update user by id
export const updateUserById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);
    const updatedUserData: Partial<User> = req.body;

    if(!userId){
      throw new ApiError(400, "User id is required");
    }

    if(!updatedUserData){
      throw new ApiError(400, "User data is required");
    }

    if(userId === res.locals.user.id){
      throw new ApiError(400, "You cannot update your own role");
    }

    if(updatedUserData.role === "superAdmin"){
      throw new ApiError(400, "You are not authorized to make this change");
    }

    const user = await getUserByIdModel(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const updatedUser = await updateUserByAdminModel(userId, updatedUserData);
    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    } 
    res.status(200).json(
      new ApiResponse(200, "User updated successfully", {
        updatedUser
      })
    );
  }
);

// Delete user by id
export const deleteUserById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);
    const deletedUser = await deleteUserModel(userId);
    if (deletedUser) {
      res.status(200).json( new ApiResponse(200, "User deleted successfully", {deletedUser}));
    }
    throw new ApiError(404, "User not found");
  }
);


// Super Admin
export const updateUserByIdSuperAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);
    const updatedUserData: Partial<User> = req.body;

    if(!userId){
      throw new ApiError(400, "User id is required");
    }

    if(!updatedUserData){
      throw new ApiError(400, "User data is required");
    }

    if(userId === res.locals.user.id){
      throw new ApiError(400, "You cannot update your own role");
    }

    const user = await getUserByIdModel(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const updatedUser = await updateUserByAdminModel(userId, updatedUserData);
    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    } 
    res.status(200).json(
      new ApiResponse(200, "User updated successfully", {
        updatedUser
      })
    );
  }
);


