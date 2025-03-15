import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET ; // Use env in production

// ✅ REGISTER A NEW USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, birthday, Gender,  } = req.body;

    // Validate required fields
    if (!name || !email || !password || !birthday || !Gender ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate birthday
    const parsedBirthday = new Date(birthday);
    if (isNaN(parsedBirthday)) {
      return res.status(400).json({ message: "Invalid birthday format" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user 
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, birthday: parsedBirthday,   gender:Gender.toUpperCase()},
    });

    return res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email, name:user.name }, SECRET_KEY, { expiresIn: "7d" });

    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGOUT USER
export const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE USER ACCOUNT
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find and delete user
    await prisma.user.delete({ where: { id: userIdNum } });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, birthday: true, Gender: true,  createdAt: true },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET A SINGLE USER BY ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userIdNum },
      select: { id: true, name: true, email: true, birthday: true, Gender: true,  createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
