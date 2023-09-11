import { body, param } from "express-validator";

const userNameValidationChain = () =>
  body("username")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Username cannot be empty!")
    .isString()
    .withMessage("Username not a String");

const idValidationChain = () =>
  param("_id")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("User _id field cannot be empty!")
    .isString()
    .isLength({ min: 24, max: 24 })
    .withMessage("No valid user id!");
 

const exerciseValidationChain = () =>
  body(["description", "duration",])
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Description or duration cannot be empty!")
    .isString()
    .withMessage("Description or duration not a String!");

export { userNameValidationChain as userValidationChain, idValidationChain, exerciseValidationChain };
