import prisma from "../lib/prisma.js";

const AUTHORITY_TYPES = ["POLICE", "HEALTHCARE", "NGO"];

const parseId = (value) => {
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
};

// Trims the provided fields and validates them; `partial` allows omitting fields on update.
const buildAuthorityData = (body, { partial }) => {
  const data = {};
  for (const field of ["name", "contact", "location"]) {
    if (body[field] === undefined) {
      if (!partial) return { error: "Missing required fields" };
      continue;
    }
    const value = String(body[field]).trim();
    if (!value) return { error: `${field} cannot be empty` };
    data[field] = value;
  }
  if (body.category === undefined) {
    if (!partial) return { error: "Missing required fields" };
  } else {
    const category = String(body.category).toUpperCase();
    if (!AUTHORITY_TYPES.includes(category)) {
      return { error: `Category must be one of ${AUTHORITY_TYPES.join(", ")}` };
    }
    data.category = category;
  }
  return { data };
};

export const createAuthority = async (req, res) => {
  try {
    const { data, error } = buildAuthorityData(req.body, { partial: false });
    if (error) {
      return res.status(400).json({ error });
    }

    const newAuthority = await prisma.authority.create({ data });

    return res
      .status(201)
      .json({ message: "Authority created successfully", authority: newAuthority });
  } catch (error) {
    console.error("Create Authority Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllAuthorities = async (req, res) => {
  try {
    const category = req.query.category?.toUpperCase();
    if (category && !AUTHORITY_TYPES.includes(category)) {
      return res.status(400).json({ error: "Invalid category filter" });
    }

    const authorities = await prisma.authority.findMany({
      where: category ? { category } : undefined,
      orderBy: { name: "asc" },
    });
    return res.status(200).json(authorities);
  } catch (error) {
    console.error("Get All Authorities Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAuthorityById = async (req, res) => {
  try {
    const id = parseId(req.params.authorityId);
    if (!id) {
      return res.status(400).json({ error: "Invalid authority ID" });
    }

    const authority = await prisma.authority.findUnique({ where: { id } });
    if (!authority) {
      return res.status(404).json({ error: "Authority not found" });
    }
    return res.status(200).json(authority);
  } catch (error) {
    console.error("Get Authority Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateAuthority = async (req, res) => {
  try {
    const id = parseId(req.params.authorityId);
    if (!id) {
      return res.status(400).json({ error: "Invalid authority ID" });
    }
    const { data, error } = buildAuthorityData(req.body, { partial: true });
    if (error) {
      return res.status(400).json({ error });
    }

    const updatedAuthority = await prisma.authority.update({ where: { id }, data });

    return res
      .status(200)
      .json({ message: "Authority updated successfully", authority: updatedAuthority });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Authority not found" });
    }
    console.error("Update Authority Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteAuthority = async (req, res) => {
  try {
    const id = parseId(req.params.authorityId);
    if (!id) {
      return res.status(400).json({ error: "Invalid authority ID" });
    }

    const authority = await prisma.authority.findUnique({ where: { id } });
    if (!authority) {
      return res.status(404).json({ error: "Authority not found" });
    }

    // Cases assigned to this authority are unassigned (ON DELETE SET NULL).
    await prisma.authority.delete({ where: { id } });

    return res.status(200).json({ message: "Authority deleted successfully" });
  } catch (error) {
    console.error("Delete Authority Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
