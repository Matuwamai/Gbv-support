import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createComment = async (req, res) => {
  try {
    const { content, userId, postId } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = await prisma.comment.create({
      data: { content, userId, postId },
    });

    return res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    console.error("Create Comment Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({ where: { id: parseInt(postId) } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId) },
      include: { 
        user: { 
          select: { id: true, name: true, profileImage: true } 
        } 
      },
      orderBy: { createdAt: "asc" },
    });
    const updatedComments = comments.map(comment => ({
      ...comment,
      user: {
        ...comment.user,
        profileImage: comment.user.profileImage 
          ? `${process.env.BASE_URL}${comment.user.profileImage}` 
          : null,
      }
    }));

    return res.status(200).json(updatedComments);
  } catch (error) {
    console.error("Get Comments Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
      include: { user: { select: { id: true, name: true, profileImage: true } } },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json(comment);
  } catch (error) {
    console.error("Get Comment Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const existingComment = await prisma.comment.findUnique({ where: { id: parseInt(commentId) } });
    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
    });

    return res.status(200).json({ message: "Comment updated successfully", updatedComment });
  } catch (error) {
    console.error("Update Comment Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const existingComment = await prisma.comment.findUnique({ where: { id: parseInt(commentId) } });
    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    await prisma.comment.delete({ where: { id: parseInt(commentId) } });

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
