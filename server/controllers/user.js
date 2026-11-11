import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { withUserImage } from "../lib/media.js";
import { toUploadPath, removeUpload } from "../lib/upload.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

// Fields that are safe to send back to the client (never the password hash).
const publicUserFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  birthday: true,
  gender: true,
  profileImage: true,
  contact: true,
  createdAt: true,
};

// Accept "Male", "female", "Others", ... and map them onto the Gender enum.
const normalizeGender = (value) => {
  if (!value || typeof value !== "string") return null;
  const upper = value.trim().toUpperCase();
  if (upper === "MALE" || upper === "FEMALE") return upper;
  if (upper === "OTHER" || upper === "OTHERS") return "OTHER";
  return null;
};

const parseBirthday = (value) => {
  const date = new Date(value);
  if (isNaN(date.getTime()) || date > new Date()) return null;
  return date;
};

const stripPassword = ({ password, ...user }) => user; // eslint-disable-line no-unused-vars

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, birthday } = req.body;
    // The client historically sent "Gender"; accept both spellings.
    const gender = normalizeGender(req.body.gender ?? req.body.Gender);

    if (!name?.trim() || !email?.trim() || !password || !birthday || !(req.body.gender ?? req.body.Gender)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res
        .status(400)
        .json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }
    if (!gender) {
      return res.status(400).json({ message: "Gender must be Male, Female or Other" });
    }
    const parsedBirthday = parseBirthday(birthday);
    if (!parsedBirthday) {
      return res.status(400).json({ message: "Invalid birthday" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        birthday: parsedBirthday,
        gender,
      },
      select: publicUserFields,
    });

    return res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Email already registered" });
    }
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
    if (!process.env.JWT_SECRET) {
      console.error("Login Error: JWT_SECRET is not configured");
      return res.status(500).json({ message: "Server is not configured for login" });
    }

    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res
      .status(200)
      .json({ message: "Login successful", token, user: withUserImage(stripPassword(user)) });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Tokens are stateless; the client discards its copy.
export const logoutUser = (req, res) =>
  res.status(200).json({ message: "User logged out successfully" });

export const deleteUser = async (req, res) => {
  try {
    const userIdNum = parseInt(req.params.userId, 10);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({ where: { id: userIdNum } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove everything that references the user before deleting them, otherwise
    // the foreign-key constraints (ON DELETE RESTRICT) make the delete fail.
    const posts = await prisma.post.findMany({
      where: { userId: userIdNum },
      select: { id: true, mediaUrl: true },
    });
    const postIds = posts.map((post) => post.id);

    await prisma.$transaction([
      prisma.likeDislike.deleteMany({
        where: { OR: [{ userId: userIdNum }, { comment: { userId: userIdNum } }] },
      }),
      prisma.repost.deleteMany({ where: { userId: userIdNum } }),
      prisma.case.deleteMany({
        where: { OR: [{ userId: userIdNum }, { postId: { in: postIds } }] },
      }),
      prisma.comment.updateMany({
        where: { parent: { userId: userIdNum } },
        data: { parentId: null },
      }),
      prisma.comment.deleteMany({ where: { userId: userIdNum } }),
      prisma.post.deleteMany({ where: { userId: userIdNum } }),
      prisma.user.delete({ where: { id: userIdNum } }),
    ]);

    await Promise.all([
      removeUpload(user.profileImage),
      ...posts.map((post) => removeUpload(post.mediaUrl)),
    ]);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: publicUserFields,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(users.map(withUserImage));
  } catch (error) {
    console.error("Get Users Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userIdNum = parseInt(req.params.userId, 10);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userIdNum },
      select: publicUserFields,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(withUserImage(user));
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const profileImage = toUploadPath(req.file);
  try {
    const userIdNum = parseInt(req.params.userId, 10);
    if (isNaN(userIdNum)) {
      await removeUpload(profileImage);
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const { name, email, birthday, gender, contact } = req.body;
    const updateData = {};

    if (name?.trim()) updateData.name = name.trim();
    if (email) {
      if (!EMAIL_REGEX.test(email.trim())) {
        await removeUpload(profileImage);
        return res.status(400).json({ message: "Invalid email address" });
      }
      updateData.email = email.trim().toLowerCase();
    }
    if (birthday) {
      const parsedBirthday = parseBirthday(birthday);
      if (!parsedBirthday) {
        await removeUpload(profileImage);
        return res.status(400).json({ message: "Invalid birthday" });
      }
      updateData.birthday = parsedBirthday;
    }
    if (gender) {
      const normalizedGender = normalizeGender(gender);
      if (!normalizedGender) {
        await removeUpload(profileImage);
        return res.status(400).json({ message: "Gender must be Male, Female or Other" });
      }
      updateData.gender = normalizedGender;
    }
    if (contact !== undefined && contact !== null) updateData.contact = String(contact).trim() || null;
    if (profileImage) updateData.profileImage = profileImage;

    const existingUser = await prisma.user.findUnique({ where: { id: userIdNum } });
    if (!existingUser) {
      await removeUpload(profileImage);
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userIdNum },
      data: updateData,
      select: publicUserFields,
    });

    if (profileImage && existingUser.profileImage) {
      await removeUpload(existingUser.profileImage);
    }

    return res.status(200).json(withUserImage(updatedUser));
  } catch (error) {
    await removeUpload(profileImage);
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Email already in use" });
    }
    console.error("Update User Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
