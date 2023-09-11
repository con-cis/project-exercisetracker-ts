import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { userValidationChain, idValidationChain } from "../utilities/validationChains";
import User from "../models/Users";

interface UserResponse {
  _id: string;
  username: string;
}

/**
 * Get a user by ID.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await validateIdParam(req, res, next);
    const id = req.params._id;
    const userWithId: User | null = await User.findById(id);

    if (userWithId !== null) {
      const responseObj: UserResponse = {
        _id: id,
        username: userWithId.username,
      };
      res.status(200).json(responseObj);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error getting user entry:", error);
  }
};

/**
 * Get all users.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find();
    const responseObj: UserResponse[] = users.map((user) => ({
      _id: user._id.toString(),
      username: user.username,
    }));
    res.status(200).json(responseObj);
  } catch (error) {
    console.error("Error getting all user entries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Create a new user.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await validateUser(req, res, next);
    const username = req.body.username;
    const user = new User({ username });
    const savedUser = await user.save();
    const responseObj: UserResponse = {
      _id: savedUser._id.toString(),
      username: savedUser.username,
    };
    res.status(201).json(responseObj);
  } catch (error) {
    console.error("Error creating user entry:", error);
  }
};

/**
 * Validate user data.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const validationChain = userValidationChain();
  await validationChain.run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(500).send(errors.array()[0].msg);
    throw { error: "Invalid user entry", errors: errors.array() };
  }
};

/**
 * Validate ID parameter.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
const validateIdParam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const validationChain = idValidationChain();
  await validationChain.run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(500).send(errors.array()[0].msg);
    throw { error: "Invalid userID", errors: errors.array() };
  }
};

export { getUser, getUsers, createNewUser };
