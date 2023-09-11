import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import {
  idValidationChain,
  exerciseValidationChain,
} from "../utilities/validationChains";
import User from "../models/Users";
import { Exercise } from "../models/Exercise";
import { Types, ObjectId, PipelineStage } from "mongoose";
const ObjectId = Types.ObjectId;

interface ExerciseResponse {
  _id: ObjectId;
  username: string;
  date: string;
  duration: number;
  description: string;
}

interface ExercisesResponse {
  _id: ObjectId;
  username: string;
  count: number;
  from?: string;
  to?: string;
  limit: number;
  log: Array<Exercise>;
}
/**
 * Creates a new exercise entry for a user.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
const createExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params._id;
    await validateIdParam(req, res, next);
    await validateExercisePostBody(req, res, next);

    const userWithId = await User.findById(id);

    if (!userWithId) {
      return res.status(404).json({ error: "User not found" });
    }

    const date = req.body.date ? new Date(req.body.date) : new Date();

    const exercise: Exercise = {
      description: req.body.description,
      duration: req.body.duration,
      date: date,
    };

    userWithId.log = [...(userWithId.log || []), exercise];
    userWithId.count = userWithId.log.length;

    const savedUser = await userWithId.save();

    const formattedDate = date instanceof Date ? date.toDateString() : "";

    const responseObj: ExerciseResponse = {
      _id: savedUser.id,
      username: savedUser.username,
      date: formattedDate,
      duration: parseInt(req.body.duration),
      description: req.body.description,
    };

    res.status(201).json(responseObj);
  } catch (error) {
    console.error("Error creating exercise entry: ", error);
  }
};

/**
 * Retrieves exercises for a user based on query parameters.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
const getExercises = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await validateIdParam(req, res, next);

    const userId = req.params._id;

    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const { from, to, limit } = req.query;
    const fromDate = from ? new Date(from as string) : undefined;
    const toDate = to ? new Date(to as string) : undefined;

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: { _id: new ObjectId(userId) },
      },
      {
        $unwind: "$log",
      },
    ];

    if (fromDate) {
      aggregationPipeline.push({
        $match: {
          "log.date": { $gte: fromDate },
        },
      });
    }

    if (toDate) {
      aggregationPipeline.push({
        $match: {
          "log.date": { $lte: toDate },
        },
      });
    }

    const limitNumber = parseInt(limit as string);
    if (!isNaN(limitNumber)) {
      aggregationPipeline.push({
        $limit: limitNumber,
      });
    }

    aggregationPipeline.push({
      $group: {
        _id: "$_id",
        username: { $first: "$username" },
        count: { $first: "$count" },
        log: { $push: "$log" },
      },
    });

    let user = await User.aggregate(aggregationPipeline);

    if (user.length === 0) {
      const emptyLogUser = await User.findById(userId);
      const responseObj = {
        _id: userId,
        username: emptyLogUser?.username,
        from: fromDate?.toDateString(),
        to: toDate?.toDateString(),
        limit: limit,
        count: 0,
        log: [],
      };
      return res.status(200).json(responseObj);
    }

    const formattedLog = user[0].log.map(
      (exercise: Exercise): Object => ({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date?.toDateString(),
      })
    );

    const responseObj: ExercisesResponse = {
      _id: user[0]._id,
      username: user[0].username,
      count: user[0].count,
      from: fromDate?.toDateString(),
      to: toDate?.toDateString(),
      limit: limitNumber,
      log: formattedLog,
    };

    res.status(200).json(responseObj);
  } catch (errors) {
    console.error("Error logging all exercises: ", errors);
  }
};

const validateExercisePostBody = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const validationChain = exerciseValidationChain();
  await validationChain.run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(500).send(errors.array()[0].msg);
    throw new Error("invalid exercise entry");
  }
};

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
    throw new Error("invalid id entry");
  }
};

export { createExercise, getExercises };
