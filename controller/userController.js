import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Token from "../models/Token.js";
import { registerValidation,loginValidation,} from "../validation/authValidation.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const user = await User.create({ name, email, password, role: "customer" });

    res.status(201).json({
      message: "User registered successfully",
      user: { email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ error: error });

    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role !== role) {
      return res.status(403).json({
        error: ` You are registered as ${user.role}, not ${role}`,
      });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid password" });

    if (!process.env.JWT_ACCESS_SECRET) {
      return res.status(500).json({ message: "Internal server error!", error });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    try {
      await Token.create({
        user: user._id,
        accessToken,
        refreshToken,
      });
    } catch (error) {

      return res
        .status(500)
        .json({
          error: "Failed to save tokens to database",
        error: error.message,
        });
    }

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
