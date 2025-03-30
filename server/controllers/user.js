import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET ; 
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, birthday, Gender,  } = req.body;
    if (!name || !email || !password || !birthday || !Gender ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const parsedBirthday = new Date(birthday);
    if (isNaN(parsedBirthday)) {
      return res.status(400).json({ message: "Invalid birthday format" });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, birthday: parsedBirthday,   gender:Gender.toUpperCase()},
    });

    return res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id, email: user.email, name:user.name }, SECRET_KEY, { expiresIn: "7d" });

    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    await prisma.user.delete({ where: { id: userIdNum } });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, birthday: true, gender: true,  createdAt: true },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userIdNum },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        birthday: true, 
        gender: true, 
        profileImage: true,
        contact: true,      
        createdAt: true 
      },
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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userIdNum = parseInt(userId);

    if (isNaN(userIdNum)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const { contact } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
    const updateData = { contact };
    if (profileImage) {
      updateData.profileImage = profileImage;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userIdNum },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        birthday: true,
        gender: true,
        profileImage: true,
        contact: true,
        createdAt: true,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
