import { Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  let statusCode = 201;
  try {
    if (!process.env.JWT_SECRET) {
      statusCode = 500;
      throw new Error("Env Secret not loaded");
    }

    let { email, password, username } = req.body;
    if (!email) {
      statusCode = 400;
      throw new Error("Invalid Email");
    }
    if (!password) {
      statusCode = 400;
      throw new Error("Invalid Password");
    }
    if (!username) {
      statusCode = 400;
      throw new Error("Invalid Username");
    }
    const exists = await UserModel.findOne({
      $or: [{ email }, { username }],
    }).lean();
    if (exists) {
      statusCode = 500;
      throw new Error(
        exists.email === email
          ? "Email already registered"
          : "Username already registered"
      );
    }

    password = await bcrypt.hash(password, 12);
    const user = await UserModel.create({ email, password, username });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    res
      .status(statusCode)
      .json({ success: true, message: `Successfully registered user`, token });
  } catch (error: any) {
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  let statusCode = 200;
  try {
    if (!process.env.JWT_SECRET) {
      statusCode = 500;
      throw new Error("Env Secret not loaded");
    }
    let { email, password, username } = req.body;
    if (!email && !username) {
      statusCode = 400;
      throw new Error("Invalid email or username");
    }
    if (!password) {
      statusCode = 400;
      throw new Error("Invalid Password");
    }

    const exists = await UserModel.findOne({
      $or: [{ email }, { username }],
    }).lean();
    if (!exists) {
      statusCode = 500;
      throw new Error(`No such user exists`);
    }
    const isPasswordMatching: boolean = await bcrypt.compare(
      password,
      exists.password
    );
    if (!isPasswordMatching) {
      statusCode = 400;
      throw new Error("No such user with pas exists");
    }
    const token = jwt.sign({ _id: exists._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    res
      .status(statusCode)
      .json({
        success: true,
        message: `Successfully logged in with user`,
        token,
      });
  } catch (error: any) {
    res.status(statusCode).json({ success: false, message: error.message });
  }
};
