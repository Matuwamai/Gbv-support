import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createCase = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    
    if (!userId || !postId) {
      return res.status(400).json({ error: "Missing required fields: userId and postId" });
    }
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }
    const postExists = await prisma.post.findUnique({ where: { id: postId } });
    if (!postExists) {
      return res.status(404).json({ error: "Post not found" });
    }
    const newCase = await prisma.case.create({
      data: { 
        userId, 
        postId 
      },
    });

    return res.status(201).json({ message: "Case reported successfully", case: newCase });
  } catch (error) {
    console.error("Create Case Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllCases = async (req, res) => {
  try {
    const cases = await prisma.case.findMany({
      include: {
        user: { select: { id: true, name: true } },
        post: { select: { id: true, content: true } },
        assignedTo: { select: { id: true, name: true, contact: true } },
      },
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
    const { caseId } = req.params;
    if (!caseId || isNaN(caseId)) {
      return res.status(400).json({ error: "Invalid case ID" });
    }

    const caseItem = await prisma.case.findUnique({
      where: { id: parseInt(caseId) },
      include: {
        user: { select: { id: true, name: true } },
        post: { select: { id: true, content: true } },
        assignedTo: { select: { id: true, name: true, contact: true } },
      },
    });

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
      const { caseId } = req.params;
      if (!caseId || isNaN(caseId)) {
        return res.status(400).json({ error: "Invalid case ID" });
      }
  
      const { status, assignedToId } = req.body;
      if (assignedToId !== undefined && assignedToId !== null) {
        const authorityExists = await prisma.authority.findUnique({
          where: { id: assignedToId },
        });
        if (!authorityExists) {
          return res.status(404).json({ error: "Authority not found" });
        }
      }
  
      const updatedCase = await prisma.case.update({
        where: { id: parseInt(caseId) },
        data: { status, assignedToId },
      });
  
      return res.status(200).json({ message: "Case updated successfully", case: updatedCase });
    } catch (error) {
      console.error("Update Case Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
export const deleteCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    if (!caseId || isNaN(caseId)) {
      return res.status(400).json({ error: "Invalid case ID" });
    }
    const existingCase = await prisma.case.findUnique({ where: { id: parseInt(caseId) } });
    if (!existingCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    await prisma.case.delete({ where: { id: parseInt(caseId) } });
    return res.status(200).json({ message: "Case deleted successfully" });
  } catch (error) {
    console.error("Delete Case Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
