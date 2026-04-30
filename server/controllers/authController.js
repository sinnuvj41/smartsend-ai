import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = () => {
  return jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials."
      });
    }

    const token = generateToken();

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token
    });
  } catch (error) {
    next(error);
  }
};