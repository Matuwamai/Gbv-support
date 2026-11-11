import prisma from "../lib/prisma.js";

const CASE_STATUSES = ["PENDING", "IN_PROGRESS", "RESOLVED"];

const caseInclude = {
  user: { select: { id: true, name: true } },
  post: { select: { id: true, content: true } },
  assignedTo: { select: { id: true, name: true, contact: true } },
};

const parseId = (value) => {
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
};

// Any signed-in user can report a post; the reporter comes from the token.
export const createCase = async (req, res) => {
  try {
    const postId = parseId(req.body.postId);
    if (!postId) {
      return res.status(400).json({ error: "Missing or invalid postId" });
    }

    const postExists = await prisma.post.findUnique({ where: { id: postId } });
    if (!postExists) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userId = req.user.id;
    const existingCase = await prisma.case.findFirst({ where: { userId, postId } });
    if (existingCase) {
      return res.status(409).json({ error: "You have already reported this post", case: existingCase });
    }

    const newCase = await prisma.case.create({ data: { userId, postId } });

    return res.status(201).json({ message: "Case reported successfully", case: newCase });
  } catch (error) {
    console.error("Create Case Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllCases = async (req, res) => {
  try {
    const { status } = req.query;
    if (status && !CASE_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid status filter" });
    }

    const cases = await prisma.case.findMany({
      where: status ? { status } : undefined,
      include: caseInclude,
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(cases);
  } catch (error) {
    console.error("Get All Cases Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const caseId = parseId(req.params.caseId);
    if (!caseId) {
      return res.status(400).json({ error: "Invalid case ID" });
    }

    const caseItem = await prisma.case.findUnique({ where: { id: caseId }, include: caseInclude });
    if (!caseItem) {
      return res.status(404).json({ error: "Case not found" });
    }

    return res.status(200).json(caseItem);
  } catch (error) {
    console.error("Get Case Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateCase = async (req, res) => {
  try {
    const caseId = parseId(req.params.caseId);
    if (!caseId) {
      return res.status(400).json({ error: "Invalid case ID" });
    }

    const { status, assignedToId } = req.body;
    const data = {};

    if (status !== undefined) {
      if (!CASE_STATUSES.includes(status)) {
        return res.status(400).json({ error: `Status must be one of ${CASE_STATUSES.join(", ")}` });
      }
      data.status = status;
    }

    if (assignedToId === null) {
      data.assignedToId = null;
    } else if (assignedToId !== undefined) {
      const authorityId = parseId(assignedToId);
      if (!authorityId) {
        return res.status(400).json({ error: "Invalid assignedToId" });
      }
      const authorityExists = await prisma.authority.findUnique({ where: { id: authorityId } });
      if (!authorityExists) {
        return res.status(404).json({ error: "Authority not found" });
      }
      data.assignedToId = authorityId;
    }

    const existingCase = await prisma.case.findUnique({ where: { id: caseId } });
    if (!existingCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    const updatedCase = await prisma.case.update({
      where: { id: caseId },
      data,
      include: caseInclude,
    });

    return res.status(200).json({ message: "Case updated successfully", case: updatedCase });
  } catch (error) {
    console.error("Update Case Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteCase = async (req, res) => {
  try {
    const caseId = parseId(req.params.caseId);
    if (!caseId) {
      return res.status(400).json({ error: "Invalid case ID" });
    }

    const existingCase = await prisma.case.findUnique({ where: { id: caseId } });
    if (!existingCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    await prisma.case.delete({ where: { id: caseId } });
    return res.status(200).json({ message: "Case deleted successfully" });
  } catch (error) {
    console.error("Delete Case Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
