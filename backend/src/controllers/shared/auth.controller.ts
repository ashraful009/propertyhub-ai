import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../../repositories/shared/user.repository";

//                                   User Registration

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // input validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // check exist user
    const userExists = await findUserByEmail(email);
    if (userExists) {
      res.status(400).json({ error: "User already exist" });
      return;
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Insert new User
    const newUser = await createUser({
      name,
      email,
      password: hashPassword,
      role: role || "CUSTOMER",
    });

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: newUser,
    });
  } catch (error) {
    console.log("Registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//                            User Login

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(400).json({ error: "Invalid credintials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid Credential" });
      return;
    }

    // Gen JWT
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
        {id: user.id},
        process.env.JWT_REFRESH_SECRET as string, 
        {expiresIn: '7d'}
    );
    
    // set refresh token in HttpOnly

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
