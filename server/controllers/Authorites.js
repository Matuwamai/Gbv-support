import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create a new Authority
export const createAuthority = async (req, res) => {
  try {
    const { name, contact, location, category } = req.body;
    if (!name || !contact || !location || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newAuthority = await prisma.authority.create({
      data: { name, contact, location, category },
    });

    return res
      .status(201)
      .json({ message: "Authority created successfully", authority: newAuthority });
  } catch (error) {
    console.error("Create Authority Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all Authorities
export const getAllAuthorities = async (req, res) => {
  try {
    const authorities = await prisma.authority.findMany({
      orderBy: { name: "asc" },
    });
    return res.status(200).json(authorities);
  } catch (error) {
    console.error("Get All Authorities Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single Authority by ID
export const getAuthorityById = async (req, res) => {
  try {
    const { authorityId } = req.params;
    const authority = await prisma.authority.findUnique({
      where: { id: parseInt(authorityId) },
    });
    if (!authority) {
      return res.status(404).json({ error: "Authority not found" });
    }
    return res.status(200).json(authority);
  } catch (error) {
    console.error("Get Authority Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update an Authority
export const updateAuthority = async (req, res) => {
  try {
    const { authorityId } = req.params;
    const { name, contact, location, category } = req.body;

    const updatedAuthority = await prisma.authority.update({
      where: { id: parseInt(authorityId) },
      data: { name, contact, location, category },
    });

    return res
      .status(200)
      .json({ message: "Authority updated successfully", authority: updatedAuthority });
  } catch (error) {
    console.error("Update Authority Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete an Authority
export const deleteAuthority = async (req, res) => {
  try {
    const { authorityId } = req.params;
    const authority = await prisma.authority.findUnique({
      where: { id: parseInt(authorityId) },
    });
    if (!authority) {
      return res.status(404).json({ error: "Authority not found" });
    }

    await prisma.authority.delete({
      where: { id: parseInt(authorityId) },
    });

    return res.status(200).json({ message: "Authority deleted successfully" });
  } catch (error) {
    console.error("Delete Authority Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
